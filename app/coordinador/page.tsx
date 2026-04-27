import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import CoordinadorClient from "./CoordinadorClient";

export default async function CoordinadorPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, role: true },
  });

  if (!user || !["coordinador", "administrador"].includes(user.role)) {
    redirect("/dashboard");
  }

  const students = await prisma.user.findMany({
    where: { role: "estudiante" },
    select: { id: true, name: true, email: true, academicLevel: true },
  });

  const allSessions = await prisma.session.findMany({
    include: { user: { select: { id: true } } },
  });

  const studentStats = students.map((u) => {
    const userSessions = allSessions.filter((s) => s.user.id === u.id);
    const completedSessions = userSessions.filter((s) => s.status === "completed");
    const avgProgress =
      userSessions.length > 0
        ? Math.round(
            userSessions.reduce(
              (acc, s) => acc + (s.currentStage / 18) * 100,
              0
            ) / userSessions.length
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
      topDifficulty: difficulties[0] ?? null,
    };
  });

  const totalCompleted = allSessions.filter((s) => s.status === "completed").length;

  const allDifficulties: string[] = [];
  for (const s of allSessions) {
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
    Object.entries(diffCount).sort(([, a], [, b]) => b - a)[0]?.[0] ?? null;

  return (
    <CoordinadorClient
      userName={user.name}
      summary={{
        totalStudents: students.length,
        totalSessions: allSessions.length,
        completedSessions: totalCompleted,
        topDifficulty,
      }}
      students={studentStats}
    />
  );
}
