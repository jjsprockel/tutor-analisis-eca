import Image from "next/image";
import Link from "next/link";
import { BookOpen, Target, Layers, Users, ArrowLeft, GraduationCap, Brain, CheckCircle } from "lucide-react";

export const metadata = {
  title: "Acerca del Tutor IA · ECA — Universidad FUCS",
  description:
    "Tutor IA para la lectura crítica de ensayos clínicos aleatorizados, basado en el Manual para la Lectura Crítica de la Literatura de John Sprockel, Editorial FUCS.",
};

export default function AcercaPage() {
  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      {/* Header */}
      <header className="bg-white border-b border-[#e0e3e5] shadow-sm">
        <div className="max-w-5xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image src="/logo-fucs.png" alt="Universidad FUCS" width={80} height={40} className="h-10 w-auto object-contain" priority />
            <div className="w-px h-7 bg-[#e0e3e5]" />
            <span className="text-base font-bold text-[#1E293B] tracking-tight">Tutor IA · ECA</span>
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-sm text-[#45474c] hover:text-[#1E293B] transition-colors"
          >
            <ArrowLeft size={15} />
            Volver al dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-8 py-12 space-y-14">

        {/* Hero */}
        <section className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#6df5e1]/30 text-[#005048] text-xs font-semibold px-4 py-1.5 rounded-full border border-[#14B8A6]/30 uppercase tracking-wider">
            <BookOpen size={13} />
            Herramienta educativa · Medicina Interna · FUCS
          </div>
          <h1 className="text-4xl font-bold text-[#1E293B] tracking-tight leading-tight">
            Tutor IA para la Lectura Crítica<br />de Ensayos Clínicos Aleatorizados
          </h1>
          <p className="text-lg text-[#45474c] max-w-2xl mx-auto leading-relaxed">
            Una herramienta de inteligencia artificial diseñada para acompañar a estudiantes de medicina en el análisis sistemático y crítico de la literatura científica, con base en la metodología del programa académico de la Fundación Universitaria de Ciencias de la Salud.
          </p>
        </section>

        {/* Libro base */}
        <section className="bg-[#1E293B] rounded-2xl overflow-hidden shadow-xl">
          <div className="grid md:grid-cols-5 gap-0">
            <div className="md:col-span-2 bg-gradient-to-br from-[#14B8A6]/20 to-[#1E293B] flex items-center justify-center p-10">
              <div className="w-36 h-48 bg-white rounded-lg shadow-2xl flex flex-col items-center justify-center p-4 text-center gap-2 border-t-4 border-[#14B8A6]">
                <BookOpen size={28} className="text-[#14B8A6]" />
                <p className="text-[10px] font-bold text-[#1E293B] leading-tight uppercase tracking-wide">
                  Manual para la Lectura Crítica de la Literatura
                </p>
                <p className="text-[9px] text-[#45474c]">Orientado a Ciencias Clínicas</p>
                <div className="w-full h-px bg-[#e0e3e5] my-1" />
                <p className="text-[9px] font-semibold text-[#14B8A6]">Editorial FUCS</p>
              </div>
            </div>
            <div className="md:col-span-3 p-8 md:p-10 text-white flex flex-col justify-center gap-4">
              <p className="text-xs font-semibold text-[#4fdbc8] uppercase tracking-widest">Obra de referencia</p>
              <h2 className="text-2xl font-bold leading-snug">
                Manual para la Lectura Crítica de la Literatura Orientado a Ciencias Clínicas
              </h2>
              <div className="space-y-1">
                <p className="text-[#8590a6] text-sm font-medium">Autor</p>
                <p className="text-white text-lg font-semibold">John Sprockel</p>
              </div>
              <div className="space-y-1">
                <p className="text-[#8590a6] text-sm font-medium">Editorial</p>
                <p className="text-white">Editorial FUCS — Fundación Universitaria de Ciencias de la Salud</p>
              </div>
              <p className="text-[#8590a6] text-sm leading-relaxed">
                Esta obra constituye el marco metodológico central del Tutor IA. Toda la estructura de análisis, las preguntas guiadas, los conceptos estadísticos y los criterios de evaluación crítica están alineados con los capítulos y la propuesta pedagógica del manual, especialmente en lo relacionado con el diseño, la validez interna y la aplicabilidad de los ensayos clínicos aleatorizados.
              </p>
            </div>
          </div>
        </section>

        {/* Objetivos */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#1E293B] flex items-center justify-center flex-shrink-0">
              <Target size={18} className="text-[#4fdbc8]" />
            </div>
            <h2 className="text-2xl font-semibold text-[#1E293B]">Objetivos del aplicativo</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                title: "Desarrollar competencias en lectura crítica",
                body: "Guiar al estudiante a través de un análisis progresivo y estructurado de un ECA, desde la introducción hasta la discusión, fortaleciendo la capacidad de evaluar la validez interna y externa de los estudios.",
              },
              {
                title: "Razonamiento clínico-estadístico",
                body: "Entrenar la interpretación de medidas de asociación (RR, OR, HR), intervalos de confianza, valor p, reducción absoluta del riesgo (RRA) y número necesario a tratar (NNT) en contextos clínicos reales.",
              },
              {
                title: "Aprendizaje activo y socrático",
                body: "El tutor formula preguntas antes de explicar, permite que el estudiante construya su comprensión y solo proporciona las respuestas cuando el estudiante ha tenido la oportunidad de razonar por sí mismo.",
              },
              {
                title: "Aplicabilidad clínica",
                body: "Desarrollar el juicio para trasladar los hallazgos estadísticos a decisiones clínicas reales, reconociendo las limitaciones de los estudios y los sesgos potenciales que afectan la validez de los resultados.",
              },
            ].map((obj) => (
              <div key={obj.title} className="bg-white rounded-xl border border-[#e0e3e5] p-6 shadow-sm flex gap-4">
                <CheckCircle size={18} className="text-[#14B8A6] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-[#1E293B] mb-1">{obj.title}</h3>
                  <p className="text-sm text-[#45474c] leading-relaxed">{obj.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cómo funciona */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#1E293B] flex items-center justify-center flex-shrink-0">
              <Layers size={18} className="text-[#4fdbc8]" />
            </div>
            <h2 className="text-2xl font-semibold text-[#1E293B]">Estructura del análisis</h2>
          </div>
          <p className="text-[#45474c] text-sm leading-relaxed max-w-3xl">
            El tutor guía al estudiante a través del documento completo, sección por sección, sin basarse en el resumen. Cada etapa corresponde a un componente metodológico del artículo y está diseñada para desarrollar una competencia específica de lectura crítica.
          </p>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { n: "1–2", section: "Introducción", desc: "Problema clínico, contexto y objetivo primario del estudio." },
              { n: "3",   section: "Hipótesis y diseño", desc: "Tipo de hipótesis: superioridad, no inferioridad o equivalencia. Implicaciones para el análisis." },
              { n: "4–5", section: "Métodos — Aleatorización y cegamiento", desc: "Método de aleatorización, ocultación de la secuencia y tipos de cegamiento." },
              { n: "6",   section: "Métodos — Población", desc: "Criterios de inclusión y exclusión. Representatividad y aplicabilidad externa." },
              { n: "7",   section: "Métodos — Desenlaces", desc: "Desenlace primario y secundarios. Distinción entre desenlaces clínicos directos y sustitutos (surrogate endpoints)." },
              { n: "8",   section: "Métodos — Análisis estadístico", desc: "Tamaño de muestra, α, poder estadístico (1−β), diferencia mínima clínicamente importante. Análisis por intención de tratar (ITT) vs. por protocolo." },
              { n: "9",   section: "Resultados — Flujo de pacientes", desc: "Diagrama CONSORT: aleatorización, seguimiento, pérdidas y motivos de exclusión en cada grupo." },
              { n: "10",  section: "Resultados — Características basales", desc: "Comparabilidad de los grupos al inicio. Identificación de posibles factores de confusión." },
              { n: "11",  section: "Resultados — Desenlace primario", desc: "Medida de asociación principal (RR, OR, HR), IC 95% y valor p. Explicación de RRR, RRA y NNT con escenarios clínicos." },
              { n: "12",  section: "Resultados — Figuras", desc: "Interpretación de curvas de supervivencia (Kaplan-Meier): separación, convergencia y durabilidad del efecto. Forest plots: dirección del efecto, intervalos de confianza y consistencia entre subgrupos." },
              { n: "13",  section: "Resultados — Análisis de subgrupos", desc: "Identificación de subgrupos prespecificados vs. exploratorios. Interpretación de heterogeneidad del efecto y sus implicaciones." },
              { n: "14",  section: "Resultados — Eventos adversos", desc: "Perfil de seguridad en cada grupo. Balance riesgo-beneficio de la intervención." },
              { n: "15",  section: "Discusión y sesgos", desc: "Sesgos de selección, información y confusión. Limitaciones reconocidas por los autores. Aplicabilidad al contexto local." },
              { n: "16",  section: "Retroalimentación final", desc: "Evaluación cualitativa del proceso: comprensión metodológica, interpretación estadística, juicio clínico y aplicabilidad." },
            ].map((stage) => (
              <div key={stage.n} className="flex gap-4 bg-white rounded-xl border border-[#e0e3e5] p-4 shadow-sm">
                <div className="w-9 h-9 rounded-full bg-[#1E293B] flex items-center justify-center text-[#4fdbc8] text-xs font-bold flex-shrink-0">
                  {stage.n}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1E293B]">{stage.section}</p>
                  <p className="text-xs text-[#45474c] mt-0.5 leading-relaxed">{stage.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Metodología pedagógica */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#1E293B] flex items-center justify-center flex-shrink-0">
              <Brain size={18} className="text-[#4fdbc8]" />
            </div>
            <h2 className="text-2xl font-semibold text-[#1E293B]">Metodología pedagógica</h2>
          </div>
          <div className="bg-white rounded-xl border border-[#e0e3e5] p-8 shadow-sm space-y-5">
            {[
              {
                title: "Método socrático adaptado",
                body: "El tutor formula una sola pregunta por turno y espera la respuesta del estudiante antes de explicar. Esto obliga al estudiante a consultar el texto del artículo y razonar de manera independiente, en lugar de recibir información pasivamente.",
              },
              {
                title: "Progresión controlada",
                body: "El análisis avanza de forma estrictamente secuencial. No es posible saltar etapas, lo que garantiza que el estudiante construya comprensión acumulativa desde los fundamentos metodológicos hasta la interpretación de resultados y la evaluación crítica.",
              },
              {
                title: "Retroalimentación inmediata y diferida",
                body: "Cada respuesta recibe validación o corrección inmediata. Al final de la sesión, el tutor genera una retroalimentación cualitativa global que evalúa la comprensión metodológica, estadística, el juicio clínico y la capacidad de aplicar los hallazgos al contexto local.",
              },
              {
                title: "Texto completo como fuente principal",
                body: "El análisis se basa siempre en el texto completo del artículo, no en el resumen. Esto desarrolla el hábito de leer y evaluar la sección de métodos con el rigor necesario para identificar limitaciones que rara vez aparecen en los abstracts.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 border-b border-[#f2f4f6] pb-5 last:border-0 last:pb-0">
                <div className="w-2 h-2 rounded-full bg-[#14B8A6] flex-shrink-0 mt-2" />
                <div>
                  <p className="text-sm font-semibold text-[#1E293B] mb-1">{item.title}</p>
                  <p className="text-sm text-[#45474c] leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Audiencia */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#1E293B] flex items-center justify-center flex-shrink-0">
              <Users size={18} className="text-[#4fdbc8]" />
            </div>
            <h2 className="text-2xl font-semibold text-[#1E293B]">Dirigido a</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: GraduationCap, title: "Internos de medicina", body: "Estudiantes de último año que inician su formación en medicina basada en evidencia y lectura crítica de la literatura." },
              { icon: GraduationCap, title: "Residentes de Medicina Interna", body: "Médicos en formación que deben integrar la evidencia científica en la toma de decisiones clínicas cotidianas." },
              { icon: BookOpen, title: "Docentes y tutores", body: "Profesores que deseen complementar sus actividades de enseñanza con una herramienta de evaluación formativa continua." },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl border border-[#e0e3e5] p-6 shadow-sm text-center flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#f2f4f6] flex items-center justify-center">
                  <item.icon size={22} className="text-[#14B8A6]" />
                </div>
                <h3 className="text-sm font-semibold text-[#1E293B]">{item.title}</h3>
                <p className="text-xs text-[#45474c] leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer institucional */}
        <footer className="border-t border-[#e0e3e5] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image src="/logo-fucs.png" alt="FUCS" width={60} height={30} className="h-8 w-auto object-contain" />
            <div>
              <p className="text-sm font-medium text-[#1E293B]">Fundación Universitaria de Ciencias de la Salud</p>
              <p className="text-xs text-[#75777d]">Facultad de Medicina · Programa de Medicina Interna</p>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="bg-[#1E293B] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Ir al aplicativo
          </Link>
        </footer>
      </main>
    </div>
  );
}
