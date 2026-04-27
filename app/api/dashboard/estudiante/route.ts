import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const userId = session.user.id;

  const [sessions, user] = await Promise.all([
    prisma.session.findMany({
      where: { userId },
      include: { article: { select: { title: true, filename: true } } },
      orderBy: { updatedAt: "desc" },
      take: 20,
    }),
    prisma.user.findUnique({ where: { id: userId }, select: { name: true, academicLevel: true } }),
  ]);

  const total = sessions.length;
  const completed = sessions.filter((s) => s.status === "completed").length;
  const active = sessions.find((s) => s.status === "active" || s.status === "paused");

  const difficulties: string[] = [];
  for (const s of sessions) {
    if (s.finalFeedback) {
      try {
        const fb = JSON.parse(s.finalFeedback);
        if (fb.difficulties) difficulties.push(...fb.difficulties);
      } catch {}
    }
  }

  const difficultyCount: Record<string, number> = {};
  for (const d of difficulties) {
    difficultyCount[d] = (difficultyCount[d] || 0) + 1;
  }
  const topDifficulty =
    Object.entries(difficultyCount).sort(([, a], [, b]) => b - a)[0]?.[0] || null;

  return NextResponse.json({
    userName: user?.name,
    academicLevel: user?.academicLevel,
    stats: { total, completed, active: sessions.filter((s) => s.status === "active").length },
    activePausedSession: active
      ? {
          id: active.id,
          articleTitle: active.article.title || active.article.filename,
          status: active.status,
          currentStage: active.currentStage,
        }
      : null,
    topDifficulty,
    recentSessions: sessions.slice(0, 10).map((s) => ({
      id: s.id,
      articleTitle: s.article.title || s.article.filename,
      status: s.status,
      currentStage: s.currentStage,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
      hasFeedback: !!s.finalFeedback,
    })),
  });
}
