import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { generateTutorReply } from "@/lib/ai/geminiClient";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const { articleId } = await req.json();

    if (!articleId) {
      return NextResponse.json({ error: "articleId es requerido." }, { status: 400 });
    }

    const article = await prisma.article.findFirst({
      where: { id: articleId, userId: session.user.id },
    });

    if (!article) {
      return NextResponse.json({ error: "Artículo no encontrado." }, { status: 404 });
    }

    if (!article.isRCT) {
      return NextResponse.json({ error: "El artículo no es un ECA válido." }, { status: 400 });
    }

    const normative = await prisma.normativeContent.findMany();
    const normativeText = normative.map((n) => `${n.title}:\n${n.content}`).join("\n\n");

    const sessionRecord = await prisma.session.create({
      data: {
        userId: session.user.id,
        articleId,
        status: "active",
        currentStage: 1,
      },
    });

    const tutorReply = await generateTutorReply(
      { stage: 1, messages: [], articleTitle: article.title || undefined },
      article.processedText,
      normativeText,
      "__inicio__"
    );

    await prisma.tutorMessage.create({
      data: {
        sessionId: sessionRecord.id,
        role: "tutor",
        content: tutorReply.message,
        stage: 1,
      },
    });

    return NextResponse.json({
      sessionId: sessionRecord.id,
      tutorMessage: tutorReply.message,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error creando la sesión." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const sessions = await prisma.session.findMany({
    where: { userId: session.user.id },
    include: { article: { select: { title: true, filename: true } } },
    orderBy: { updatedAt: "desc" },
    take: 20,
  });

  return NextResponse.json(sessions);
}
