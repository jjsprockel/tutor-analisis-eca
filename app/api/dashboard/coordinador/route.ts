import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const userRecord = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!userRecord || !["coordinador", "administrador"].includes(userRecord.role)) {
    return NextResponse.json({ error: "Acceso denegado." }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const dateFilter =
    from && to
      ? { createdAt: { gte: new Date(from), lte: new Date(to) } }
      : {};

  const [users, sessions] = await Promise.all([
    prisma.user.findMany({
      where: { role: "estudiante" },
      select: { id: true, name: true, email: true, academicLevel: true },
    }),
    prisma.session.findMany({
      where: dateFilter,
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const studentStats = users.map((u) => {
    const userSessions = sessions.filter((s) => s.user.id === u.id);
    const completedSessions = userSessions.filter((s) => s.status === "completed");
    const avgProgress =
      userSessions.length > 0
        ? Math.round(
            userSessions.reduce((acc, s) => acc + (s.currentStage / 18) * 100, 0) /
              userSessions.length
          )
        : 0;
    const totalTime = userSessions.reduce((acc, s) => acc + s.accumulatedTime, 0);

    const difficulties: string[] = [];
    for (const s of userSessions) {
      if (s.finalFeedback) {
        try {
          const fb = JSON.parse(s.finalFeedback);
          if (fb.difficulties) difficulties.push(...fb.difficulties);
        } catch {}
      }
    }

    return {
      id: u.id,
      name: u.name,
      email: u.email,
      academicLevel: u.academicLevel,
      totalSessions: userSessions.length,
      completedSessions: completedSessions.length,
      avgProgress,
      totalTime,
      topDifficulty: difficulties[0] || null,
    };
  });

  const allDifficulties: string[] = [];
  for (const s of sessions) {
    if (s.finalFeedback) {
      try {
        const fb = JSON.parse(s.finalFeedback);
        if (fb.difficulties) allDifficulties.push(...fb.difficulties);
      } catch {}
    }
  }
  const diffCount: Record<string, number> = {};
  for (const d of allDifficulties) diffCount[d] = (diffCount[d] || 0) + 1;
  const topDifficulty =
    Object.entries(diffCount).sort(([, a], [, b]) => b - a)[0]?.[0] || null;

  return NextResponse.json({
    summary: {
      totalStudents: users.length,
      totalSessions: sessions.length,
      completedSessions: sessions.filter((s) => s.status === "completed").length,
      topDifficulty,
    },
    students: studentStats,
  });
}
