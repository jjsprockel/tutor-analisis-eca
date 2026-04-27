import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { generateFinalFeedback } from "@/lib/ai/geminiClient";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { id } = await params;

  const sessionRecord = await prisma.session.findFirst({
    where: { id, userId: session.user.id },
    include: {
      article: true,
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!sessionRecord) {
    return NextResponse.json({ error: "Sesión no encontrada." }, { status: 404 });
  }

  const messages = sessionRecord.messages.map((m) => ({
    role: m.role,
    content: m.content,
    stage: m.stage,
  }));

  const feedback = await generateFinalFeedback({
    stage: sessionRecord.currentStage,
    messages,
    articleTitle: sessionRecord.article.title || undefined,
  });

  await prisma.session.update({
    where: { id },
    data: {
      status: "completed",
      finalFeedback: JSON.stringify(feedback),
    },
  });

  return NextResponse.json(feedback);
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { id } = await params;

  const sessionRecord = await prisma.session.findFirst({
    where: { id, userId: session.user.id },
    select: { finalFeedback: true, status: true, article: { select: { title: true } } },
  });

  if (!sessionRecord) {
    return NextResponse.json({ error: "Sesión no encontrada." }, { status: 404 });
  }

  if (!sessionRecord.finalFeedback) {
    return NextResponse.json({ error: "Retroalimentación no disponible aún." }, { status: 404 });
  }

  return NextResponse.json({
    feedback: JSON.parse(sessionRecord.finalFeedback),
    articleTitle: sessionRecord.article.title,
  });
}
