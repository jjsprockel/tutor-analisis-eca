import { buildSystemPrompt, buildStagePrompt } from "./rctTutorPrompt";

export interface RCTValidationResult {
  isRCT: boolean;
  confidence: number;
  title?: string;
  studyType?: string;
  designType?: string;
  intervention?: string;
  comparator?: string;
  randomization?: string;
  blinding?: string;
  primaryOutcome?: string;
  extractionLimited?: boolean;
  reason?: string;
}

export interface TutorReply {
  message: string;
  stage: number;
  advanceStage: boolean;
}

export interface FinalFeedback {
  methodologicalComprehension: string;
  statisticalInterpretation: string;
  clinicalJudgment: string;
  applicability: string;
  strengths: string[];
  difficulties: string[];
  validityJudgment: string;
  importanceJudgment: string;
  applicabilityJudgment: string;
}

const MOCK_RCT_VALIDATION: RCTValidationResult = {
  isRCT: true,
  confidence: 0.95,
  title: "Eficacia de la intervención farmacológica en pacientes adultos: ensayo clínico aleatorizado controlado",
  studyType: "Ensayo clínico aleatorizado",
  designType: "Superioridad",
  intervention: "Intervención farmacológica (tratamiento activo)",
  comparator: "Placebo o tratamiento estándar",
  randomization: "Aleatorización 1:1 por bloques permutados",
  blinding: "Doble ciego (pacientes e investigadores)",
  primaryOutcome: "Reducción del desenlace primario a 12 semanas",
  extractionLimited: false,
};

const MOCK_STAGE_MESSAGES: Record<number, string[]> = {
  1:  ["¡Bienvenido al análisis crítico de este ensayo clínico aleatorizado! Analizaremos el artículo sección por sección.\n\nComencemos por la **Introducción**: ¿cuál es el problema clínico que motivó este estudio según los autores?"],
  2:  ["Bien. Siguiendo en la **Introducción**, ¿cuál es el **objetivo primario** del estudio tal como lo plantean los autores?"],
  3:  ["Correcto. En **Métodos**: ¿el estudio plantea una hipótesis de **superioridad**, **no inferioridad** o **equivalencia**? ¿Qué implicaciones tiene?"],
  4:  ["Bien. ¿Cómo se realizó la **aleatorización**? Describe el método y si se menciona la ocultación de la secuencia."],
  5:  ["Correcto. ¿Existe **cegamiento**? ¿Quiénes están cegados: pacientes, investigadores, evaluadores? ¿Qué tipo?"],
  6:  ["Bien. Leyendo los **criterios de elegibilidad**: ¿cuáles son los criterios de inclusión y exclusión más relevantes?"],
  7:  ["Bien. En la subsección de **desenlaces**: ¿cuál es el **desenlace primario** y cómo se mide? ¿Es clínico directo o sustituto?"],
  8:  ["Correcto. En **análisis estadístico**: ¿cómo se calculó el **tamaño de muestra**? ¿El análisis fue por **ITT** o por protocolo?"],
  9:  ["Bien. Ubica el **diagrama de flujo CONSORT**: ¿cuántos fueron aleatorizados? ¿Cuántos completaron? ¿Motivos de pérdida?"],
  10: ["Bien. Lee la **tabla de características basales**: ¿son los grupos comparables? ¿Hay diferencias que pudieran confundir?"],
  11: ["Bien. Leyendo los **resultados del desenlace primario**: ¿cuál fue la tasa de eventos en el grupo intervención y en el grupo control? ¿Cuál es la **medida de asociación** reportada (RR, OR o HR) y cuál es su valor? Explica qué representa ese número y de dónde procede."],
  12: ["Bien. A partir de esas tasas, calcula la **RRA** (Reducción Absoluta del Riesgo), la **RRR** (Reducción Relativa del Riesgo) y el **NNT** (Número Necesario a Tratar). ¿Cuál refleja mejor el beneficio real para un paciente individual?"],
  13: ["Bien. ¿Cuál es el **valor p** del desenlace primario? ¿Cuál es el **IC 95 %**? ¿Cruza la línea de no efecto? ¿Cómo distingues **significancia estadística** de **relevancia clínica**?"],
  14: ["Bien. Busca las **figuras de resultados**: curvas de supervivencia y forest plots. ¿Qué muestran? ¿Cómo interpretas la separación de curvas o la distribución de los intervalos en el forest plot?"],
  15: ["Bien. ¿Existen **análisis de subgrupos**? ¿Estaban prespecificados o son exploratorios? ¿Hay algún subgrupo con resultado notablemente diferente al efecto principal?"],
  16: ["Bien. Leyendo la sección de **eventos adversos**: ¿cuáles fueron los más relevantes? ¿Cómo afecta el perfil de seguridad al balance riesgo-beneficio?"],
  17: ["Bien. En la **Discusión**: ¿cuál es el **sesgo** más relevante y cómo lo manejaron los autores? ¿Son los resultados aplicables a tu contexto?"],
  18: ["Excelente trabajo completando el análisis. A continuación encontrarás la retroalimentación cualitativa sobre tu proceso."],
};

async function callGemini(prompt: string, systemInstruction: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return "";

  const TIMEOUT_MS = 25_000;

  try {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction,
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Gemini timeout")), TIMEOUT_MS)
    );

    const result = await Promise.race([
      model.generateContent(prompt),
      timeoutPromise,
    ]);
    return result.response.text();
  } catch (err) {
    console.error("Gemini error:", err);
    return "";
  }
}

export async function validateRCTArticle(
  articleText: string
): Promise<RCTValidationResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    await new Promise((r) => setTimeout(r, 800));
    const limited = articleText.length < 500;
    return { ...MOCK_RCT_VALIDATION, extractionLimited: limited };
  }

  const prompt = `Analiza el siguiente texto extraído de un artículo científico y determina si corresponde a un ensayo clínico aleatorizado (ECA/RCT).

Responde ÚNICAMENTE en formato JSON con esta estructura exacta:
{
  "isRCT": boolean,
  "confidence": number (0-1),
  "title": string o null,
  "studyType": string o null,
  "designType": "Superioridad" | "No inferioridad" | "Equivalencia" | null,
  "intervention": string o null,
  "comparator": string o null,
  "randomization": string o null,
  "blinding": string o null,
  "primaryOutcome": string o null,
  "extractionLimited": boolean,
  "reason": string
}

Texto del artículo (primeros 4000 caracteres):
${articleText.substring(0, 4000)}`;

  const system = `Eres un experto en metodología de investigación clínica. Tu tarea es identificar si un artículo es un ECA y extraer sus características metodológicas clave. Responde SOLO con JSON válido.`;

  try {
    const response = await callGemini(prompt, system);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as RCTValidationResult;
    }
  } catch {}

  return { ...MOCK_RCT_VALIDATION, extractionLimited: articleText.length < 500 };
}

export async function generateTutorReply(
  sessionState: {
    stage: number;
    messages: { role: string; content: string }[];
    articleTitle?: string;
    requestHint?: boolean;
    requestExplain?: boolean;
  },
  articleText: string,
  normativeContent: string,
  studentMessage: string
): Promise<TutorReply> {
  const { stage, messages, requestHint, requestExplain } = sessionState;
  const apiKey = process.env.GEMINI_API_KEY;

  const mode = studentMessage === "__inicio__"
    ? "init"
    : requestHint
    ? "hint"
    : requestExplain
    ? "explain"
    : "respond";

  if (!apiKey) {
    await new Promise((r) => setTimeout(r, 600));
    const stageMsgs = MOCK_STAGE_MESSAGES[stage] || MOCK_STAGE_MESSAGES[1];
    return { message: stageMsgs[0], stage, advanceStage: mode !== "hint" };
  }

  const system = buildSystemPrompt(normativeContent);
  const stageContext = buildStagePrompt(stage, articleText, mode);

  const history = messages
    .slice(-12)
    .map((m) => `${m.role === "tutor" ? "Tutor" : "Estudiante"}: ${m.content}`)
    .join("\n");

  const prompt = mode === "init"
    ? stageContext
    : `${stageContext}

HISTORIAL (últimas intervenciones):
${history}

RESPUESTA DEL ESTUDIANTE:
${studentMessage}`;

  try {
    const response = await callGemini(prompt, system);
    if (response) {
      return { message: response, stage, advanceStage: true };
    }
  } catch (err) {
    console.error("[generateTutorReply] Gemini error:", err);
  }

  // Fallback: use mock message
  const stageMsgs = MOCK_STAGE_MESSAGES[stage] || MOCK_STAGE_MESSAGES[1];
  return { message: stageMsgs[0], stage, advanceStage: true };
}

export async function generateFinalFeedback(sessionState: {
  stage: number;
  messages: { role: string; content: string; stage: number }[];
  articleTitle?: string;
}): Promise<FinalFeedback> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    await new Promise((r) => setTimeout(r, 800));
    return {
      methodologicalComprehension:
        "El estudiante demostró una comprensión sólida del diseño del estudio, identificando correctamente los elementos de aleatorización, cegamiento y control de sesgos. Reconoció la diferencia entre estudios explicativos y pragmáticos.",
      statisticalInterpretation:
        "Se observó una adecuada comprensión de las medidas de asociación. El estudiante pudo distinguir entre la reducción relativa y absoluta del riesgo, y comprendió el concepto de NNT en contexto clínico.",
      clinicalJudgment:
        "El estudiante mostró capacidad para contextualizar los hallazgos estadísticos en términos de relevancia clínica, identificando cuándo un resultado estadísticamente significativo puede o no ser clínicamente importante.",
      applicability:
        "Se demostró reflexión crítica sobre la aplicabilidad de los resultados al contexto local, considerando las características de la población del estudio y las del entorno de práctica.",
      strengths: [
        "Identificación correcta del tipo de diseño y la pregunta PICO",
        "Comprensión del proceso de aleatorización y su propósito",
        "Análisis adecuado del desenlace primario y las medidas de asociación",
        "Reflexión sobre la aplicabilidad en el contexto local",
      ],
      difficulties: [
        "Interpretación inicial de los intervalos de confianza",
        "Distinción entre significancia estadística y relevancia clínica",
      ],
      validityJudgment:
        "El artículo presenta una validez interna adecuada con un proceso de aleatorización bien descrito y cegamiento consistente con los estándares CONSORT.",
      importanceJudgment:
        "Los resultados son clínicamente importantes en la medida en que el NNT es razonable y el desenlace primario es relevante para la práctica clínica.",
      applicabilityJudgment:
        "Los resultados son aplicables con precaución al contexto local, considerando las diferencias en la población y la disponibilidad de la intervención.",
    };
  }

  const system = buildSystemPrompt("");
  const history = sessionState.messages
    .map((m) => `[Etapa ${m.stage}] ${m.role === "tutor" ? "Tutor" : "Estudiante"}: ${m.content}`)
    .join("\n");

  const prompt = `Basándote en toda la sesión de análisis crítico del ECA, genera una retroalimentación final cualitativa.

SESIÓN COMPLETA:
${history}

Responde ÚNICAMENTE en formato JSON:
{
  "methodologicalComprehension": string,
  "statisticalInterpretation": string,
  "clinicalJudgment": string,
  "applicability": string,
  "strengths": string[],
  "difficulties": string[],
  "validityJudgment": string,
  "importanceJudgment": string,
  "applicabilityJudgment": string
}

No emitas ninguna nota numérica. Sé específico y cualitativo.`;

  try {
    const response = await callGemini(prompt, system);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]) as FinalFeedback;
  } catch {}

  return {
    methodologicalComprehension: "Análisis completado satisfactoriamente.",
    statisticalInterpretation: "Comprensión estadística adecuada para el nivel académico.",
    clinicalJudgment: "Juicio clínico en desarrollo, con aspectos positivos.",
    applicability: "El estudiante reflexionó sobre la aplicabilidad.",
    strengths: ["Completó todas las etapas del análisis"],
    difficulties: ["Requiere práctica adicional en interpretación estadística"],
    validityJudgment: "Validez interna adecuada.",
    importanceJudgment: "Resultados clínicamente relevantes.",
    applicabilityJudgment: "Aplicable con consideraciones locales.",
  };
}
