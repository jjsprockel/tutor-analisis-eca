"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { signOut } from "next-auth/react";
import {
  Rocket,
  CheckCircle,
  Hourglass,
  AlertTriangle,
  Plus,
  Play,
  BookOpen,
  LogOut,
  User,
  ArrowRight,
  UploadCloud,
  Loader2,
  XCircle,
  FileText,
  Trash2,
} from "lucide-react";
import { formatDate, STATUS_LABELS, STATUS_COLORS } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Session {
  id: string;
  articleTitle: string;
  status: string;
  currentStage: number;
  updatedAt: string;
  hasFeedback: boolean;
}

interface Props {
  userName: string;
  userRole: string;
  stats: { total: number; completed: number; active: number };
  activePausedSession: {
    id: string;
    articleTitle: string;
    status: string;
    currentStage: number;
  } | null;
  topDifficulty: string | null;
  recentSessions: Session[];
}

const STAGE_NAMES = [
  "",
  "Introducción",
  "Objetivo",
  "Hipótesis y diseño",
  "Aleatorización",
  "Cegamiento",
  "Población",
  "Desenlaces",
  "Análisis estadístico",
  "Resultados · Flujo de pacientes",
  "Resultados · Características basales",
  "Resultados · Medida de asociación",
  "Resultados · RRA · RRR · NNT",
  "Resultados · Significancia estadística",
  "Resultados · Figuras",
  "Resultados · Subgrupos",
  "Resultados · Eventos adversos",
  "Discusión y sesgos",
  "Retroalimentación",
];

type UploadState = "idle" | "processing" | "error";

function UploadZone({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [statusMsg, setStatusMsg] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleFile(f: File) {
    setErrorMsg("");
    if (!f.name.endsWith(".pdf") && f.type !== "application/pdf") {
      setErrorMsg("Solo se aceptan archivos PDF.");
      return;
    }
    if (f.size > 25 * 1024 * 1024) {
      setErrorMsg("El archivo supera el límite de 25 MB.");
      return;
    }

    setUploadState("processing");
    setStatusMsg("Verificando artículo…");

    try {
      const formData = new FormData();
      formData.append("pdf", f);
      const res = await fetch("/api/articulo", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Error al procesar el PDF.");
        setUploadState("error");
        return;
      }

      if (!data.isRCT) {
        setErrorMsg(data.reason || "El artículo no corresponde a un ECA válido.");
        setUploadState("error");
        return;
      }

      setStatusMsg("Iniciando sesión de análisis…");

      const res2 = await fetch("/api/sesion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId: data.id }),
      });
      const data2 = await res2.json();

      if (!res2.ok) {
        setErrorMsg(data2.error || "Error al crear la sesión.");
        setUploadState("error");
        return;
      }

      router.push(`/analisis/${data2.sessionId}`);
    } catch {
      setErrorMsg("Error de conexión. Intenta nuevamente.");
      setUploadState("error");
    }
  }

  function reset() {
    setUploadState("idle");
    setErrorMsg("");
    setStatusMsg("");
  }

  // Compact button (top nav area)
  if (compact) {
    return (
      <div className="flex flex-col gap-2">
        {uploadState === "processing" ? (
          <div className="flex items-center gap-2 text-sm text-[#45474c] px-4 py-2.5">
            <Loader2 size={15} className="animate-spin text-[#14B8A6]" />
            {statusMsg}
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-[#1E293B] text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all"
          >
            <Plus size={16} />
            Subir artículo ECA
          </button>
        )}
        {errorMsg && (
          <p className="text-xs text-[#93000a] flex items-center gap-1">
            <XCircle size={12} className="flex-shrink-0" />
            {errorMsg}
            <button onClick={reset} className="underline ml-1">Reintentar</button>
          </p>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
        />
      </div>
    );
  }

  // Always-visible inline drop zone (used in sessions section)
  return (
    <div className="px-4 py-3">
      {uploadState === "processing" ? (
        <div className="flex items-center gap-3 justify-center py-2">
          <Loader2 size={18} className="text-[#14B8A6] animate-spin flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-[#1E293B]">{statusMsg}</p>
            <p className="text-xs text-[#75777d]">Esto puede tardar unos segundos…</p>
          </div>
        </div>
      ) : uploadState === "error" ? (
        <div className="flex items-center gap-3 justify-center py-1">
          <XCircle size={18} className="text-[#93000a] flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-[#1E293B]">Artículo no compatible</p>
            <p className="text-xs text-[#45474c]">{errorMsg}</p>
          </div>
          <button
            onClick={reset}
            className="ml-auto text-xs text-[#14B8A6] font-medium hover:underline whitespace-nowrap"
          >
            Intentar de nuevo
          </button>
        </div>
      ) : (
        <>
          <div
            className={cn(
              "border-2 border-dashed rounded-xl px-6 py-4 flex items-center gap-4 cursor-pointer transition-colors",
              dragOver ? "border-[#14B8A6] bg-[#6df5e1]/10" : "border-[#c5c6cd] hover:border-[#14B8A6] hover:bg-[#f7f9fb]"
            )}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-10 h-10 rounded-full bg-[#f2f4f6] flex items-center justify-center flex-shrink-0">
              <UploadCloud size={20} className={cn("transition-colors", dragOver ? "text-[#14B8A6]" : "text-[#1E293B]")} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#1E293B]">
                {dragOver ? "Suelta el PDF aquí" : "Arrastra el PDF del artículo aquí"}
              </p>
              <p className="text-xs text-[#75777d] mt-0.5">O haz clic para seleccionar · Solo PDF · Máx. 25 MB</p>
            </div>
            <span className="text-xs font-medium text-[#14B8A6] hidden sm:block whitespace-nowrap">Nuevo análisis</span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
          />
        </>
      )}
    </div>
  );
}

export default function DashboardClient({
  userName,
  userRole,
  stats,
  activePausedSession,
  topDifficulty,
  recentSessions: initialSessions,
}: Props) {
  const router = useRouter();
  const [sessions, setSessions] = useState(initialSessions);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(e: React.MouseEvent, sessionId: string) {
    e.stopPropagation();
    if (!confirm("¿Eliminar esta sesión y su historial de mensajes? Esta acción no se puede deshacer.")) return;
    setDeletingId(sessionId);
    try {
      const res = await fetch(`/api/sesion/${sessionId}`, { method: "DELETE" });
      if (res.ok) {
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      }
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      {/* Top Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-sm h-16">
        <div className="flex justify-between items-center h-16 px-8 w-full max-w-[1440px] mx-auto">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Image
                  src="/logo-fucs.png"
                  alt="Universidad FUCS"
                  width={80}
                  height={40}
                  className="h-10 w-auto object-contain"
                  priority
                />
              </Link>
              <div className="w-px h-8 bg-slate-200" />
              <span className="text-lg font-bold tracking-tight text-[#1E293B]">
                Tutor IA · ECA
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <span className="text-[#14B8A6] font-semibold border-b-2 border-[#14B8A6] pb-1">
                Dashboard
              </span>
              <Link href="/acerca" className="text-slate-500 hover:text-[#1E293B] transition-all">
                Acerca de
              </Link>
              <Link href="/quienes-somos" className="text-slate-500 hover:text-[#1E293B] transition-all">
                Quiénes somos
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-[#1E293B] leading-none">{userName}</p>
              <p className="text-xs text-slate-500 mt-0.5">{userRole}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#1E293B] flex items-center justify-center text-white">
              <User size={16} />
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
              title="Cerrar sesión"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="pt-24 pb-12 px-8 max-w-[1440px] mx-auto grid grid-cols-12 gap-6">
        {/* Left: 8 cols */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Welcome + upload button */}
          <section className="bg-white p-6 rounded-xl border border-[#c5c6cd] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-semibold text-[#1E293B] tracking-tight">
                Bienvenido, {userName.split(" ")[0]}
              </h1>
              <p className="text-[#45474c] mt-1 text-sm">
                Sube un artículo ECA para iniciar una sesión de análisis guiado.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <UploadZone compact />
              {activePausedSession && (
                <Link
                  href={`/analisis/${activePausedSession.id}`}
                  className="border border-[#c5c6cd] text-[#1E293B] px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-[#f2f4f6] transition-all"
                >
                  <Play size={16} />
                  Retomar sesión pausada
                </Link>
              )}
            </div>
          </section>

          {/* Active session alert */}
          {activePausedSession && (
            <div className="bg-[#6df5e1]/30 border border-[#14B8A6]/30 rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#14B8A6] flex items-center justify-center text-white flex-shrink-0">
                  <Play size={14} />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1E293B]">
                    Sesión {activePausedSession.status === "paused" ? "pausada" : "activa"}
                  </p>
                  <p className="text-xs text-[#45474c] truncate max-w-sm">
                    {activePausedSession.articleTitle} · Etapa{" "}
                    {STAGE_NAMES[activePausedSession.currentStage] ||
                      activePausedSession.currentStage}
                  </p>
                </div>
              </div>
              <Link
                href={`/analisis/${activePausedSession.id}`}
                className="flex items-center gap-1.5 text-sm font-medium text-[#006b5f] hover:underline"
              >
                Continuar
                <ArrowRight size={14} />
              </Link>
            </div>
          )}

          {/* Recent sessions */}
          <section className="bg-white rounded-xl border border-[#c5c6cd] shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#c5c6cd] flex justify-between items-center">
              <h2 className="text-xl font-semibold text-[#1E293B]">Sesiones recientes</h2>
              <FileText size={18} className="text-[#45474c]" />
            </div>

            {/* Drop zone — always visible */}
            <div className="border-b border-[#e6e8ea]">
              <UploadZone />
            </div>

            {sessions.length === 0 ? (
              <div className="p-8 text-center">
                <BookOpen size={32} className="mx-auto text-[#c5c6cd] mb-3" />
                <p className="text-sm text-[#75777d]">Aún no tienes sesiones. Arrastra un artículo ECA arriba para comenzar.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#f2f4f6] border-b border-[#c5c6cd]">
                    <tr>
                      <th className="p-4 text-xs font-semibold text-[#45474c] uppercase tracking-wider">Artículo</th>
                      <th className="p-4 text-xs font-semibold text-[#45474c] uppercase tracking-wider">Fecha</th>
                      <th className="p-4 text-xs font-semibold text-[#45474c] uppercase tracking-wider">Estado</th>
                      <th className="p-4 text-xs font-semibold text-[#45474c] uppercase tracking-wider">Etapa</th>
                      <th className="p-4 text-xs font-semibold text-[#45474c] uppercase tracking-wider">Feedback</th>
                      <th className="p-4 text-xs font-semibold text-[#45474c] uppercase tracking-wider w-10" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e6e8ea]">
                    {sessions.map((s) => (
                      <tr
                        key={s.id}
                        className="hover:bg-[#f7f9fb] transition-colors cursor-pointer group"
                        onClick={() => {
                          if (s.status === "completed" && s.hasFeedback) {
                            router.push(`/sesion/${s.id}/feedback`);
                          } else if (s.status !== "rejected") {
                            router.push(`/analisis/${s.id}`);
                          }
                        }}
                      >
                        <td className="p-4 text-sm text-[#1E293B] max-w-xs">
                          <span className="block truncate">{s.articleTitle}</span>
                        </td>
                        <td className="p-4 text-sm text-[#45474c] whitespace-nowrap">
                          {formatDate(s.updatedAt)}
                        </td>
                        <td className="p-4">
                          <span className={cn("px-2 py-1 rounded-full text-[10px] font-bold uppercase", STATUS_COLORS[s.status] || "bg-gray-100 text-gray-600")}>
                            {STATUS_LABELS[s.status] || s.status}
                          </span>
                        </td>
                        <td className="p-4 text-xs text-[#45474c]">
                          {STAGE_NAMES[s.currentStage] || `Etapa ${s.currentStage}`}
                        </td>
                        <td className="p-4 text-sm">
                          {s.hasFeedback ? (
                            <span className="text-[#006b5f] font-medium text-xs">Ver retroalimentación</span>
                          ) : s.status === "rejected" ? (
                            <span className="text-[#93000a] text-xs">No disponible</span>
                          ) : (
                            <span className="text-[#75777d] text-xs">Pendiente</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={(e) => handleDelete(e, s.id)}
                            disabled={deletingId === s.id}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-[#75777d] hover:text-[#93000a] hover:bg-[#ffdad6] disabled:opacity-40"
                            title="Eliminar sesión"
                          >
                            {deletingId === s.id
                              ? <Loader2 size={15} className="animate-spin" />
                              : <Trash2 size={15} />
                            }
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        {/* Right: 4 cols */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-[#c5c6cd] shadow-sm">
              <Rocket size={20} className="text-[#14B8A6] mb-2" />
              <p className="text-2xl font-semibold text-[#1E293B]">{stats.total.toString().padStart(2, "0")}</p>
              <p className="text-xs text-[#45474c] font-medium uppercase tracking-wider mt-1">Iniciadas</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#c5c6cd] shadow-sm">
              <CheckCircle size={20} className="text-[#14B8A6] mb-2" />
              <p className="text-2xl font-semibold text-[#1E293B]">{stats.completed.toString().padStart(2, "0")}</p>
              <p className="text-xs text-[#45474c] font-medium uppercase tracking-wider mt-1">Completadas</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#c5c6cd] shadow-sm">
              <Hourglass size={20} className="text-[#14B8A6] mb-2" />
              <p className="text-2xl font-semibold text-[#1E293B]">{stats.active.toString().padStart(2, "0")}</p>
              <p className="text-xs text-[#45474c] font-medium uppercase tracking-wider mt-1">Activas</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#c5c6cd] shadow-sm">
              <AlertTriangle size={20} className="text-[#14B8A6] mb-2" />
              <p className="text-sm font-semibold text-[#1E293B] leading-tight">
                {topDifficulty ? topDifficulty.substring(0, 20) + "…" : "Sin datos"}
              </p>
              <p className="text-xs text-[#45474c] font-medium uppercase tracking-wider mt-1">Dificultad principal</p>
            </div>
          </div>

          {/* How it works */}
          <section className="bg-[#1E293B] p-6 rounded-xl text-white shadow-lg overflow-hidden relative">
            <div className="relative z-10">
              <h2 className="text-xl font-semibold mb-5">¿Cómo funciona?</h2>
              <div className="space-y-4">
                {[
                  { n: "1", t: "Sube el artículo", d: "Arrastra o selecciona el PDF del ECA desde esta página." },
                  { n: "2", t: "Verificación IA", d: "El sistema confirma que es un ECA válido." },
                  { n: "3", t: "Análisis guiado", d: "El tutor IA te guía sección por sección: introducción, métodos, resultados y discusión." },
                  { n: "4", t: "Retroalimentación", d: "Recibe evaluación cualitativa de tu comprensión." },
                ].map((step, i) => (
                  <div key={i} className="flex gap-3">
                    <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0", i === 0 ? "bg-[#14B8A6]" : "bg-slate-700")}>
                      {step.n}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{step.t}</p>
                      <p className="text-xs text-[#8590a6] mt-0.5">{step.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-[#14B8A6] opacity-10 rounded-full blur-3xl" />
          </section>

          {/* Institution */}
          <div className="bg-[#f2f4f6] p-4 rounded-xl border border-[#c5c6cd] flex items-center gap-3">
            <Image src="/logo-fucs.png" alt="FUCS" width={40} height={40} className="h-10 w-auto object-contain" />
            <div>
              <p className="text-sm font-medium text-[#1E293B]">Universidad FUCS</p>
              <p className="text-xs text-[#45474c]">Facultad de Medicina</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
