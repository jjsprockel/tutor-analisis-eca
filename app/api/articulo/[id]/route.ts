import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("No autorizado", { status: 401 });
  }

  const { id } = await params;

  const article = await prisma.article.findFirst({
    where: { id, userId: session.user.id },
    select: { id: true, filename: true },
  });

  if (!article) {
    return new NextResponse("Artículo no encontrado", { status: 404 });
  }

  try {
    const filePath = path.join(process.cwd(), "uploads", `${id}.pdf`);
    const fileBuffer = await readFile(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${article.filename}"`,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return new NextResponse("Archivo PDF no disponible", { status: 404 });
  }
}
