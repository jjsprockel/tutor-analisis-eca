import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { generateTutorReply } from "@/lib/ai/geminiClient";
import { TOTAL_STAGES } from "@/lib/ai/rctTutorPrompt";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { id } = await params;
  const { content, requestHint, requestExplain } = await req.json();

  const sessionRecord = await prisma.session.findFirst({
    where: { id, userId: session.user.id },
    include: {
      article: true,
      messages: { orderBy: { createdAt: "asc" }, take: 30 },
    },
  });

  if (!sessionRecord) {
    return NextResponse.json({ error: "Sesión no encontrada." }, { status: 404 });
  }

  if (sessionRecord.status === "completed") {
    return NextResponse.json({ error: "La sesión ya está completada." }, { status: 400 });
  }

  const currentStage = sessionRecord.currentStage;

  // Stage always advances after a regular student response.
  // Hints stay on the same stage. Last stage (feedback) doesn't advance further.
  const shouldAdvance = !requestHint && currentStage < TOTAL_STAGES;
  const newStage = shouldAdvance ? currentStage + 1 : currentStage;
  const isCompleted = newStage >= TOTAL_STAGES;

  console.log(`[mensaje] stage=${currentStage} → ${newStage} hint=${requestHint} explain=${requestExplain}`);

  await prisma.tutorMessage.create({
    data: {
      sessionId: id,
      role: "student",
      content: requestHint ? "Dame una pista." : requestExplain ? "Ver respuesta y continuar." : content,
      stage: currentStage,
    },
  });

  const normative = await prisma.normativeContent.findMany();
  const normativeText = normative.map((n) => `${n.title}:\n${n.content}`).join("\n\n");

  const messages = sessionRecord.messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const tutorReply = await generateTutorReply(
    {
      stage: currentStage,
      messages,
      articleTitle: sessionRecord.article.title || undefined,
      requestHint: !!requestHint,
      requestExplain: !!requestExplain,
    },
    sessionRecord.article.processedText,
    normativeText,
    content
  );

  await prisma.tutorMessage.create({
    data: {
      sessionId: id,
      role: "tutor",
      content: tutorReply.message,
      stage: currentStage,
    },
  });

  await prisma.session.update({
    where: { id },
    data: {
      currentStage: newStage,
      status: isCompleted ? "completed" : "active",
    },
  });

  return NextResponse.json({
    message: tutorReply.message,
    stage: newStage,
    completed: isCompleted,
  });
}
