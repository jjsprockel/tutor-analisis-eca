import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role, academicLevel } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nombre, correo y contraseña son requeridos." },
        { status: 400 }
      );
    }

    if (!email.endsWith("@fucsalud.edu.co")) {
      return NextResponse.json(
        { error: "Solo se aceptan correos con dominio @fucsalud.edu.co" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Este correo ya está registrado." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: role || "estudiante",
        academicLevel: academicLevel || "interno",
      },
    });

    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
