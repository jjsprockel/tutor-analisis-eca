import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, FlaskConical, BookOpen, Microscope, Cpu, Users, GraduationCap } from "lucide-react";

export const metadata = {
  title: "Quiénes somos — ProfundaMente · Tutor IA ECA",
  description:
    "ProfundaMente es un laboratorio de inteligencia artificial aplicada a la salud, articulado con el Instituto de Investigaciones de la FUCS, orientado a la educación médica y la investigación clínica.",
};

export default function QuienesSomosPage() {
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
            <FlaskConical size={13} />
            Laboratorio de IA aplicada a la salud · FUCS
          </div>
          <h1 className="text-4xl font-bold text-[#1E293B] tracking-tight leading-tight">
            ProfundaMente
          </h1>
          <p className="text-lg text-[#45474c] max-w-2xl mx-auto leading-relaxed">
            Laboratorio de inteligencia artificial aplicada a la salud, orientado al desarrollo de soluciones innovadoras para la educación médica, la investigación clínica y la toma de decisiones basada en evidencia.
          </p>
        </section>

        {/* Misión del laboratorio */}
        <section className="bg-[#1E293B] rounded-2xl overflow-hidden shadow-xl">
          <div className="grid md:grid-cols-5 gap-0">
            <div className="md:col-span-2 bg-gradient-to-br from-[#14B8A6]/20 to-[#1E293B] flex items-center justify-center p-10">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-20 h-20 rounded-2xl bg-[#14B8A6]/20 border border-[#14B8A6]/40 flex items-center justify-center">
                  <FlaskConical size={36} className="text-[#4fdbc8]" />
                </div>
                <p className="text-[#4fdbc8] text-xs font-bold uppercase tracking-widest">ProfundaMente</p>
              </div>
            </div>
            <div className="md:col-span-3 p-8 md:p-10 text-white flex flex-col justify-center gap-4">
              <p className="text-xs font-semibold text-[#4fdbc8] uppercase tracking-widest">Propósito</p>
              <p className="text-[#c8d0dc] text-sm leading-relaxed">
                Integrar tecnologías avanzadas de aprendizaje automático y modelos de lenguaje con los procesos formativos y asistenciales en medicina, promoviendo una práctica más rigurosa, analítica y reflexiva.
              </p>
              <p className="text-[#c8d0dc] text-sm leading-relaxed">
                El laboratorio se enfoca en el diseño de entornos inteligentes que faciliten la comprensión de la literatura científica, el fortalecimiento del razonamiento clínico y la formación de profesionales capaces de interactuar críticamente con la evidencia.
              </p>
            </div>
          </div>
        </section>

        {/* Áreas de enfoque */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#1E293B] flex items-center justify-center flex-shrink-0">
              <Cpu size={18} className="text-[#4fdbc8]" />
            </div>
            <h2 className="text-2xl font-semibold text-[#1E293B]">Áreas de enfoque</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: BookOpen,
                title: "Procesamiento de lenguaje natural",
                body: "Análisis de documentos biomédicos y extracción de información clínica relevante a partir de texto científico.",
              },
              {
                icon: GraduationCap,
                title: "Tutoría adaptativa",
                body: "Diseño de sistemas de enseñanza inteligentes que guían al estudiante de forma personalizada y socrática.",
              },
              {
                icon: Microscope,
                title: "Analítica clínica avanzada",
                body: "Integración de modelos de lenguaje en procesos formativos y asistenciales para apoyar la toma de decisiones basada en evidencia.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl border border-[#e0e3e5] p-6 shadow-sm flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#f2f4f6] flex items-center justify-center">
                  <item.icon size={22} className="text-[#14B8A6]" />
                </div>
                <h3 className="text-sm font-semibold text-[#1E293B]">{item.title}</h3>
                <p className="text-xs text-[#45474c] leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Articulación institucional */}
        <section className="bg-white rounded-xl border border-[#e0e3e5] p-8 shadow-sm flex gap-6 items-start">
          <div className="w-12 h-12 rounded-full bg-[#f2f4f6] flex items-center justify-center flex-shrink-0 mt-0.5">
            <Users size={22} className="text-[#14B8A6]" />
          </div>
          <div className="space-y-2">
            <h2 className="text-base font-semibold text-[#1E293B]">Articulación institucional</h2>
            <p className="text-sm text-[#45474c] leading-relaxed">
              ProfundaMente se encuentra articulado con el <strong className="text-[#1E293B]">Instituto de Investigaciones de la Fundación Universitaria de Ciencias de la Salud (FUCS)</strong>, consolidándose como un espacio de convergencia entre la investigación académica, la innovación tecnológica y la práctica clínica.
            </p>
          </div>
        </section>

        {/* Dirección */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#1E293B] flex items-center justify-center flex-shrink-0">
              <GraduationCap size={18} className="text-[#4fdbc8]" />
            </div>
            <h2 className="text-2xl font-semibold text-[#1E293B]">Dirección</h2>
          </div>

          <div className="bg-white rounded-xl border border-[#e0e3e5] shadow-sm overflow-hidden">
            {/* Encabezado del director */}
            <div className="bg-[#1E293B] px-8 py-6 flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-[#14B8A6]/20 border-2 border-[#14B8A6]/40 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-[#4fdbc8]">JS</span>
              </div>
              <div>
                <p className="text-white text-lg font-bold">John Sprockel</p>
                <p className="text-[#4fdbc8] text-sm font-medium">Médico internista · Docente e investigador</p>
                <p className="text-[#8590a6] text-xs mt-0.5">Instituto de Investigaciones · FUCS</p>
              </div>
            </div>

            {/* Perfil */}
            <div className="px-8 py-6 space-y-4">
              <p className="text-sm text-[#45474c] leading-relaxed">
                Su trabajo se centra en la aplicación de la inteligencia artificial en salud, particularmente en el desarrollo de herramientas educativas basadas en modelos de lenguaje y en la integración de analítica avanzada en procesos clínicos y formativos.
              </p>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-[#1E293B]">En este proyecto, el Dr. Sprockel ha liderado de manera integral:</p>
                <ul className="space-y-2">
                  {[
                    "La estructuración conceptual y pedagógica del contenido",
                    "El diseño metodológico del sistema de lectura crítica",
                    "El desarrollo funcional de la plataforma",
                    "La conducción de las pruebas en entornos reales con estudiantes",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-[#45474c]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] flex-shrink-0 mt-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-2 pt-4 border-t border-[#f2f4f6]">
                <p className="text-sm text-[#45474c] leading-relaxed">
                  Su enfoque combina <strong className="text-[#1E293B]">rigurosidad académica con desarrollo tecnológico</strong>, orientado a construir soluciones aplicables que impacten directamente la formación médica y la calidad del análisis clínico.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer institucional */}
        <footer className="border-t border-[#e0e3e5] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image src="/logo-fucs.png" alt="FUCS" width={60} height={30} className="h-8 w-auto object-contain" />
            <div>
              <p className="text-sm font-medium text-[#1E293B]">Fundación Universitaria de Ciencias de la Salud</p>
              <p className="text-xs text-[#75777d]">Instituto de Investigaciones · ProfundaMente</p>
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
