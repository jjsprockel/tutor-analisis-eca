export const STAGES = [
  { id: 1,  name: "Introducción",                   label: "1. Introducción" },
  { id: 2,  name: "Objetivo",                       label: "2. Objetivo" },
  { id: 3,  name: "Hipótesis y diseño",             label: "3. Hipótesis y diseño" },
  { id: 4,  name: "Aleatorización",                 label: "4. Aleatorización" },
  { id: 5,  name: "Cegamiento",                     label: "5. Cegamiento" },
  { id: 6,  name: "Población",                      label: "6. Población" },
  { id: 7,  name: "Desenlaces",                     label: "7. Desenlaces" },
  { id: 8,  name: "Análisis estadístico",           label: "8. Análisis estadístico" },
  { id: 9,  name: "Resultados · Flujo",             label: "9. Resultados · Flujo de pacientes" },
  { id: 10, name: "Resultados · Población",         label: "10. Resultados · Características basales" },
  { id: 11, name: "Resultados · Medida asociación", label: "11. Resultados · Medida de asociación" },
  { id: 12, name: "Resultados · RRA · RRR · NNT",  label: "12. Resultados · RRA · RRR · NNT" },
  { id: 13, name: "Resultados · Significancia",     label: "13. Resultados · Significancia estadística" },
  { id: 14, name: "Resultados · Figuras",           label: "14. Resultados · Figuras" },
  { id: 15, name: "Resultados · Subgrupos",         label: "15. Resultados · Análisis de subgrupos" },
  { id: 16, name: "Resultados · EAs",               label: "16. Resultados · Eventos adversos" },
  { id: 17, name: "Discusión y sesgos",             label: "17. Discusión y sesgos" },
  { id: 18, name: "Retroalimentación",              label: "18. Retroalimentación" },
];

export const TOTAL_STAGES = STAGES.length;

// Question the tutor asks for each stage
export const STAGE_QUESTIONS: Record<number, string> = {
  1:  `Lee la **Introducción** del artículo. ¿Cuál es el **problema clínico** que motivó este estudio según los autores?`,
  2:  `Siguiendo en la **Introducción** (o sección de objetivos si existe), ¿cuál es el **objetivo primario** del estudio tal como lo plantean los autores?`,
  3:  `En la sección de **Métodos**, ¿el estudio plantea una hipótesis de **superioridad**, **no inferioridad** o **equivalencia**? ¿Qué implicaciones tiene esa elección para la interpretación de los resultados?`,
  4:  `En la subsección de aleatorización de **Métodos**, ¿cómo se realizó exactamente la **aleatorización**? Describe el método y si se menciona la ocultación de la secuencia.`,
  5:  `Siguiendo en **Métodos**, ¿existe **cegamiento** en este estudio? ¿Quiénes están cegados: pacientes, investigadores, evaluadores? ¿Qué tipo de cegamiento es?`,
  6:  `Leyendo los **criterios de elegibilidad** en Métodos, ¿cuáles son los criterios de inclusión y exclusión más relevantes? ¿Qué tipo de paciente queda excluido y qué implicaría eso para la aplicabilidad?`,
  7:  `En la subsección de desenlaces de **Métodos**, ¿cuál es el **desenlace primario** y cómo se mide exactamente? ¿Es un desenlace clínico directo o un sustituto (*surrogate endpoint*)?`,
  8:  `En la subsección de **análisis estadístico** de Métodos, ¿cómo se calculó el **tamaño de muestra**? Identifica el nivel de significancia (α), el poder estadístico (1−β) y la diferencia mínima clínicamente importante. ¿El análisis principal fue por **intención de tratar (ITT)** o por protocolo?`,
  9:  `Ubica el **diagrama de flujo de pacientes** (CONSORT) en la sección de Resultados. ¿Cuántos pacientes fueron aleatorizados en total? ¿Cuántos completaron el seguimiento en cada grupo? ¿Cuáles fueron los motivos principales de pérdida o retirada?`,
  10: `Lee la **tabla de características basales** (generalmente Tabla 1 en Resultados). ¿Son los grupos comparables al inicio? ¿Existen diferencias que pudieran actuar como factores de confusión?`,
  11: `Leyendo los **resultados del desenlace primario**, ¿cuál fue la tasa (o proporción) de eventos en el **grupo intervención** y en el **grupo control**? ¿Cuál es la **medida de asociación** que reportan los autores (RR, OR o HR)? ¿Cuál es su valor exacto? Explica qué representa ese número y de dónde procede.`,
  12: `A partir de las tasas de eventos de cada grupo que identificaste, calcula la **Reducción Absoluta del Riesgo (RRA)**, la **Reducción Relativa del Riesgo (RRR)** y el **Número Necesario a Tratar (NNT)**. ¿Qué diferencia hay entre la RRR y la RRA? ¿Cuál de los tres indicadores refleja mejor el beneficio real para un paciente individual?`,
  13: `¿Cuál es el **valor p** del resultado del desenlace primario? ¿Cuál es el **intervalo de confianza al 95 %** (IC 95 %)? ¿Cruza el IC 95 % la línea de no efecto (RR/HR/OR = 1, o diferencia = 0)? ¿Cómo interpretas la relación entre la **significancia estadística** y la **relevancia clínica** de este resultado?`,
  14: `Busca las **figuras de resultados** del artículo. Si hay una **curva de supervivencia** (Kaplan-Meier): ¿en qué momento se separan las curvas? ¿La separación se mantiene en el tiempo o converge? ¿Qué sugiere eso sobre la durabilidad del efecto? Si hay un **forest plot**: ¿cuál es la dirección del efecto en la mayoría de los subgrupos? ¿Los intervalos de confianza de los subgrupos cruzan la línea de no efecto? ¿Son los resultados consistentes entre subgrupos?`,
  15: `¿Existen **análisis de subgrupos** en el artículo? Identifica si estaban **prespecificados** en el protocolo o son **exploratorios** (post-hoc). ¿Hay algún subgrupo con un resultado notablemente diferente al efecto principal? ¿Cómo debe interpretarse ese hallazgo dado el carácter prespecificado o exploratorio del análisis?`,
  16: `Leyendo la sección de **seguridad o eventos adversos**, ¿cuáles fueron los eventos adversos más relevantes en cada grupo? ¿Cómo influye el perfil de seguridad en el balance riesgo-beneficio de la intervención?`,
  17: `Leyendo la **Discusión** y la subsección de limitaciones, ¿cuál es el **sesgo** más relevante que identificas y cómo lo manejaron los autores? ¿Son los resultados aplicables al contexto clínico local?`,
};

// Extra pedagogical note shown after validating the student's answer on specific stages
const STAGE_EXTRA: Record<number, string> = {
  12: `Después de validar los cálculos, ilustra OBLIGATORIAMENTE con este ejemplo pedagógico sobre **RRR vs RRA vs NNT**:
Escenario A: riesgo control 40 %, intervención 32 % → RRR 20 %, RRA 8 %, NNT 12,5.
Escenario B: riesgo control 5 %, intervención 4 % → RRR 20 %, RRA 1 %, NNT 100.
Mensaje clave: con la misma RRR del 20 %, el beneficio absoluto es radicalmente distinto según el riesgo basal. Siempre evalúa la RRA y el NNT en el contexto del riesgo basal del paciente.`,
};

export function buildSystemPrompt(normativeContent: string): string {
  return `Eres un tutor virtual experto en lectura crítica de ensayos clínicos aleatorizados (ECA).

Acompañas a internos y residentes de medicina en el análisis crítico y secuencial de un artículo científico, sección por sección. No partas nunca del resumen/abstract.

MARCO NORMATIVO:
${normativeContent}

REGLAS ESTRICTAS:
- Evalúa ÚNICAMENTE lo que el estudiante escribió en su respuesta. No uses el texto del artículo para validar ni para autocorregir.
- NUNCA reveles, cites ni parafrasees contenido del artículo en tus preguntas ni en tus validaciones. El estudiante debe leer el artículo por sí mismo.
- Valida la respuesta del estudiante en 1-2 oraciones. Complementa solo lo esencial de metodología general.
- Formula la siguiente pregunta de forma abierta, sin dar pistas ni adelantar información del artículo.
- Máximo dos párrafos por respuesta.
- No confundas significancia estadística con relevancia clínica.
- Usa **negrillas** para términos clave e *itálicas* para énfasis. El texto se renderiza en markdown.
- Nunca menciones intentos previos ni errores anteriores.
- Responde siempre en español.`;
}

// Include the article text fragment only for Results and Discussion stages,
// where the AI needs specific data (figures, numbers, adverse events).
// For Introduction and Methods stages (1-8), the student must read the article themselves.
function articleFragment(stage: number, articleText: string): string {
  if (stage >= 9) {
    return `\n\nTEXTO DEL ARTÍCULO — sección de Resultados y Discusión (solo para uso del tutor, NO para citarlo ni parafrasearlo en preguntas):\n${articleText.substring(0, 6000)}`;
  }
  return "";
}

export function buildStagePrompt(
  stage: number,
  articleText: string,
  mode: "init" | "hint" | "explain" | "respond"
): string {
  const frag = articleFragment(stage, articleText);

  if (mode === "init") {
    return `La sesión acaba de comenzar. Saluda brevemente al estudiante (1-2 oraciones) e indica que analizarán el artículo sección por sección. Luego formula esta primera pregunta: "${STAGE_QUESTIONS[1]}"`;
  }

  if (stage === 18) {
    return `El análisis del artículo ha concluido. Genera la retroalimentación cualitativa final.
Estructura la respuesta en: **comprensión metodológica**, **interpretación estadística**, **juicio clínico** y **aplicabilidad**.
Cierra con un juicio integrado sobre **validez interna**, **importancia clínica** y **aplicabilidad** al contexto local. Sin nota numérica.${frag}`;
  }

  const currentQ = STAGE_QUESTIONS[stage];
  const nextQ = STAGE_QUESTIONS[stage + 1];
  const extra = STAGE_EXTRA[stage] ?? "";
  const nextInstruction = nextQ
    ? `Luego formula esta siguiente pregunta de forma abierta, sin revelar ni citar información del artículo: "${nextQ}"`
    : `Luego genera la retroalimentación final del análisis.`;

  if (mode === "hint") {
    return `El estudiante pidió una pista conceptual sobre: "${currentQ}"
Da una orientación metodológica general (NO cites ni parafrasees el artículo). Luego reformula la misma pregunta.${frag}`;
  }

  if (mode === "explain") {
    return `El estudiante pidió la respuesta directa a: "${currentQ}"
Explica el concepto correcto con los términos clave en **negrilla** (en términos metodológicos generales, sin revelar datos específicos del artículo a menos que sea una etapa de Resultados).
${extra ? extra + "\n" : ""}${nextInstruction}${frag}`;
  }

  // mode === "respond"
  return `El estudiante acaba de responder a esta pregunta (Etapa ${stage}):
"${currentQ}"

Valida únicamente lo que el estudiante escribió (1-2 oraciones). Si hay errores conceptuales, corrígelos sin revelar los datos exactos del artículo.
${extra ? extra + "\n" : ""}${nextInstruction}${frag}`;
}
