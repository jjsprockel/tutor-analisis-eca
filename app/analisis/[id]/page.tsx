import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import AnalysisClient from "./AnalysisClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AnalysisPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  const sessionRecord = await prisma.session.findFirst({
    where: { id, userId: session.user.id },
    include: {
      article: true,
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!sessionRecord) redirect("/dashboard");

  if (sessionRecord.status === "completed") {
    redirect(`/sesion/${id}/feedback`);
  }

  return (
    <AnalysisClient
      sessionId={id}
      articleId={sessionRecord.articleId}
      currentStage={sessionRecord.currentStage}
      articleTitle={sessionRecord.article.title || sessionRecord.article.filename}
      sessionStatus={sessionRecord.status}
      initialMessages={sessionRecord.messages.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        stage: m.stage,
        createdAt: m.createdAt.toISOString(),
      }))}
    />
  );
}
