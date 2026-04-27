import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { processPDF, extractTitleFromText } from "@/lib/pdf/pdfProcessor";
import { validateRCTArticle } from "@/lib/ai/geminiClient";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("pdf") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No se encontró el archivo PDF." }, { status: 400 });
    }

    if (!file.name.endsWith(".pdf") && file.type !== "application/pdf") {
      return NextResponse.json({ error: "Solo se aceptan archivos PDF." }, { status: 400 });
    }

    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json({ error: "El archivo supera el límite de 25MB." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const { text, limited } = await processPDF(buffer);
    const detectedTitle = extractTitleFromText(text);
    const validation = await validateRCTArticle(text);

    // Create article record first to get the ID
    const article = await prisma.article.create({
      data: {
        userId: session.user.id,
        filename: file.name,
        title: validation.title || detectedTitle,
        processedText: text,
        extractedMetadata: JSON.stringify({
          studyType: validation.studyType,
          designType: validation.designType,
          intervention: validation.intervention,
          comparator: validation.comparator,
          randomization: validation.randomization,
          blinding: validation.blinding,
          primaryOutcome: validation.primaryOutcome,
          confidence: validation.confidence,
          extractionLimited: limited || validation.extractionLimited,
        }),
        isRCT: validation.isRCT,
        validationStatus: validation.isRCT ? "approved" : "rejected",
      },
    });

    // Save PDF file to disk using article ID as filename
    try {
      const uploadsDir = path.join(process.cwd(), "uploads");
      await writeFile(path.join(uploadsDir, `${article.id}.pdf`), buffer);
    } catch (err) {
      console.error("Could not save PDF file:", err);
      // Non-fatal — analysis can continue with extracted text
    }

    return NextResponse.json({
      id: article.id,
      isRCT: validation.isRCT,
      title: article.title,
      metadata: JSON.parse(article.extractedMetadata),
      extractionLimited: limited || validation.extractionLimited,
      reason: validation.reason,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error procesando el PDF." }, { status: 500 });
  }
}
