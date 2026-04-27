import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, role: true, academicLevel: true },
  });

  if (user?.role === "coordinador") redirect("/coordinador");
  if (user?.role === "administrador") redirect("/admin");

  const sessions = await prisma.session.findMany({
    where: { userId: session.user.id },
    include: { article: { select: { title: true, filename: true } } },
    orderBy: { updatedAt: "desc" },
    take: 20,
  });

  const total = sessions.length;
  const completed = sessions.filter((s) => s.status === "completed").length;
  const activeCount = sessions.filter((s) => s.status === "active").length;
  const activePaused = sessions.find(
    (s) => s.status === "active" || s.status === "paused"
  );

  const difficulties: string[] = [];
  for (const s of sessions) {
    if (s.finalFeedback) {
      try {
        const fb = JSON.parse(s.finalFeedback);
        if (fb.difficulties) difficulties.push(...fb.difficulties);
      } catch {}
    }
  }
  const topDifficulty = difficulties[0] ?? null;

  return (
    <DashboardClient
      userName={user?.name ?? ""}
      userRole={
        user?.academicLevel === "residente" ? "Residente" : "Interno"
      }
      stats={{ total, completed, active: activeCount }}
      activePausedSession={
        activePaused
          ? {
              id: activePaused.id,
              articleTitle:
                activePaused.article.title || activePaused.article.filename,
              status: activePaused.status,
              currentStage: activePaused.currentStage,
            }
          : null
      }
      topDifficulty={topDifficulty}
      recentSessions={sessions.slice(0, 10).map((s) => ({
        id: s.id,
        articleTitle: s.article.title || s.article.filename,
        status: s.status,
        currentStage: s.currentStage,
        updatedAt: s.updatedAt.toISOString(),
        hasFeedback: !!s.finalFeedback,
      }))}
    />
  );
}
