import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import FeedbackClient from "./FeedbackClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function FeedbackPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  const sessionRecord = await prisma.session.findFirst({
    where: { id, userId: session.user.id },
    include: { article: { select: { title: true, filename: true } } },
  });

  if (!sessionRecord) redirect("/dashboard");
  if (!sessionRecord.finalFeedback) redirect(`/analisis/${id}`);

  const feedback = JSON.parse(sessionRecord.finalFeedback);

  return (
    <FeedbackClient
      sessionId={id}
      articleTitle={sessionRecord.article.title || sessionRecord.article.filename}
      feedback={feedback}
    />
  );
}
