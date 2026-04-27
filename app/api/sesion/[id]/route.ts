import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";

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
    include: {
      article: true,
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!sessionRecord) {
    return NextResponse.json({ error: "Sesión no encontrada." }, { status: 404 });
  }

  return NextResponse.json(sessionRecord);
}

export async function DELETE(
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
    select: { id: true, articleId: true },
  });

  if (!sessionRecord) {
    return NextResponse.json({ error: "Sesión no encontrada." }, { status: 404 });
  }

  // Delete messages first (no cascade in schema)
  await prisma.tutorMessage.deleteMany({ where: { sessionId: id } });
  await prisma.session.delete({ where: { id } });

  // Delete the article if no other sessions reference it
  const otherSessions = await prisma.session.count({
    where: { articleId: sessionRecord.articleId },
  });
  if (otherSessions === 0) {
    await prisma.article.delete({ where: { id: sessionRecord.articleId } });
  }

  return NextResponse.json({ ok: true });
}
