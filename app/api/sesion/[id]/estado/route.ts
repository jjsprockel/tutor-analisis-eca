import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { id } = await params;
  const { status } = await req.json();

  if (!["active", "paused", "completed"].includes(status)) {
    return NextResponse.json({ error: "Estado inválido." }, { status: 400 });
  }

  const sessionRecord = await prisma.session.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!sessionRecord) {
    return NextResponse.json({ error: "Sesión no encontrada." }, { status: 404 });
  }

  const updated = await prisma.session.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json({ status: updated.status });
}
