import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";

const DEFAULT_CHAPTERS = [
  {
    chapterKey: "capitulo3",
    title: "Capítulo 3: Guía general para análisis de artículos científicos",
    content: `Este capítulo establece el marco metodológico general para el análisis crítico de artículos científicos en medicina clínica.

## Principios fundamentales del análisis crítico

El análisis crítico de la literatura científica es una habilidad esencial para la práctica médica basada en evidencia. Todo artículo debe evaluarse en tres dimensiones principales:

1. **Validez interna**: ¿Los resultados son verdaderos para la muestra estudiada? Considera: diseño del estudio, aleatorización, control de sesgos, pérdidas de seguimiento.

2. **Importancia**: ¿Los resultados son relevantes? Considera: magnitud del efecto (RR, OR, HR, NNT), precisión (IC 95%), significancia estadística vs. relevancia clínica.

3. **Aplicabilidad**: ¿Los resultados son aplicables a nuestros pacientes? Considera: características de la muestra, contexto, intervención disponible, valores del paciente.

## Estructura de la lectura crítica

- Título y autores: identificar afiliaciones, posibles conflictos de interés.
- Resumen: obtener el mensaje central antes de la lectura detallada.
- Introducción: identificar el problema clínico y la pregunta de investigación.
- Métodos: analizar el diseño, la población, la intervención y los desenlaces.
- Resultados: interpretar con medidas de asociación e IC.
- Discusión: evaluar las limitaciones reportadas por los autores.
- Conclusiones: contrastar con los datos presentados.

## Principio de no confusión entre estadística y clínica

Un resultado estadísticamente significativo (p < 0.05) no implica necesariamente relevancia clínica. El NNT y el tamaño del efecto absoluto son imprescindibles para la toma de decisiones.`,
  },
  {
    chapterKey: "capitulo5",
    title: "Capítulo 5: Lectura crítica de ensayos clínicos aleatorizados",
    content: `Este capítulo proporciona el marco específico para el análisis crítico de ensayos clínicos aleatorizados (ECA).

## Definición y características del ECA

El ECA es el diseño de máxima jerarquía para evaluar eficacia de intervenciones. Sus características fundamentales son:
- **Aleatorización**: asignación aleatoria a grupos de comparación.
- **Control**: grupo comparador (placebo, tratamiento estándar).
- **Enmascaramiento**: cegamiento de participantes y/o evaluadores.

## Tipos de ECA

- **Por objetivo**: superioridad, no inferioridad, equivalencia.
- **Por diseño**: paralelo, cruzado, factorial, en racimos.
- **Por contexto**: explicativo (eficacia en condiciones ideales) vs. pragmático (efectividad en condiciones reales).

## Declaración CONSORT

El estándar CONSORT define los elementos mínimos de reporte para ECA. Incluye el diagrama de flujo de participantes, descripción de la aleatorización, ocultación de la secuencia y análisis estadístico.

## Aleatorización y ocultación de la secuencia

La aleatorización elimina el sesgo de selección. La ocultación de la secuencia evita que los investigadores conozcan la asignación antes de incluir a un paciente. Son procesos distintos y ambos son necesarios.

## Análisis estadístico en ECA

- **Análisis por intención de tratar (ITT)**: todos los asignados son analizados en su grupo original. Estima efectividad.
- **Análisis por protocolo**: solo quienes completaron el protocolo. Estima eficacia pero puede sobreestimarla.
- **Medidas de asociación**: RR (cociente de riesgos), RRA (reducción absoluta del riesgo), NNT (número necesario a tratar).
- **Intervalos de confianza**: el IC 95% comunica la precisión del estimador.

## Evaluación de sesgos en ECA

- Sesgo de selección: mitigado por aleatorización y ocultación.
- Sesgo de información: mitigado por cegamiento.
- Sesgo de deserción: afectado por pérdidas de seguimiento (> 20% compromete validez).
- Sesgo de notificación: resultados seleccionados según significancia.

## Interpretación de resultados

Siempre interpretar:
1. Primero el estimador de efecto (RR, HR, OR) con su IC 95%.
2. Luego la significancia estadística.
3. Finalmente la relevancia clínica mediante RRA y NNT.

El NNT debe interpretarse en el contexto del riesgo basal del paciente y de la magnitud del beneficio absoluto.`,
  },
];

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const userRecord = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!userRecord || userRecord.role !== "administrador") {
    return NextResponse.json({ error: "Acceso denegado." }, { status: 403 });
  }

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

  return NextResponse.json(chapters);
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const userRecord = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!userRecord || userRecord.role !== "administrador") {
    return NextResponse.json({ error: "Acceso denegado." }, { status: 403 });
  }

  const { chapterKey, content, title } = await req.json();

  if (!chapterKey || !content) {
    return NextResponse.json({ error: "chapterKey y content son requeridos." }, { status: 400 });
  }

  const updated = await prisma.normativeContent.upsert({
    where: { chapterKey },
    update: { content, title },
    create: { chapterKey, title: title || chapterKey, content },
  });

  return NextResponse.json(updated);
}
