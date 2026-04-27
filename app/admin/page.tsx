import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import AdminClient from "./AdminClient";

const DEFAULT_CHAPTERS = [
  {
    chapterKey: "capitulo3",
    title: "Capítulo 3: Guía general para análisis de artículos científicos",
    content: `Este capítulo establece el marco metodológico general para el análisis crítico de artículos científicos en medicina clínica.

## Principios fundamentales del análisis crítico

El análisis crítico de la literatura científica es una habilidad esencial para la práctica médica basada en evidencia. Todo artículo debe evaluarse en tres dimensiones principales:

1. **Validez interna**: ¿Los resultados son verdaderos para la muestra estudiada?
2. **Importancia**: ¿Los resultados son relevantes? (RR, OR, HR, NNT)
3. **Aplicabilidad**: ¿Los resultados son aplicables a nuestros pacientes?`,
  },
  {
    chapterKey: "capitulo5",
    title: "Capítulo 5: Lectura crítica de ensayos clínicos aleatorizados",
    content: `Este capítulo proporciona el marco específico para el análisis crítico de ensayos clínicos aleatorizados (ECA).

## Definición y características del ECA

El ECA es el diseño de máxima jerarquía para evaluar eficacia de intervenciones. Sus características fundamentales son:
- Aleatorización: asignación aleatoria a grupos de comparación.
- Control: grupo comparador (placebo, tratamiento estándar).
- Enmascaramiento: cegamiento de participantes y/o evaluadores.`,
  },
];

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, role: true },
  });

  if (!user || user.role !== "administrador") redirect("/dashboard");

  let chapters = await prisma.normativeContent.findMany({
    orderBy: { chapterKey: "asc" },
  });

  if (chapters.length === 0) {
    for (const ch of DEFAULT_CHAPTERS) {
      await prisma.normativeContent.upsert({
        where: { chapterKey: ch.chapterKey },
        update: {},
        create: ch,
      });
    }
    chapters = await prisma.normativeContent.findMany({ orderBy: { chapterKey: "asc" } });
  }

  return (
    <AdminClient
      userName={user.name}
      chapters={chapters.map((ch) => ({
        id: ch.id,
        chapterKey: ch.chapterKey,
        title: ch.title,
        content: ch.content,
        updatedAt: ch.updatedAt.toISOString(),
      }))}
    />
  );
}
