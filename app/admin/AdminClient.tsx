"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  BookOpen,
  Save,
  AlertTriangle,
  CheckCircle2,
  User,
  LogOut,
  Users,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Chapter {
  id: string;
  chapterKey: string;
  title: string;
  content: string;
  updatedAt: string;
}

interface Props {
  userName: string;
  chapters: Chapter[];
}

export default function AdminClient({ userName, chapters: initialChapters }: Props) {
  const [chapters, setChapters] = useState(initialChapters);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleSave(chapter: Chapter) {
    setSaving(chapter.chapterKey);
    setError("");

    try {
      const res = await fetch("/api/admin/contenido", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapterKey: chapter.chapterKey,
          title: chapter.title,
          content: chapter.content,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Error guardando el contenido.");
      } else {
        const updated = await res.json();
        setChapters((prev) =>
          prev.map((ch) =>
            ch.chapterKey === chapter.chapterKey
              ? { ...ch, updatedAt: updated.updatedAt }
              : ch
          )
        );
        setSaved(chapter.chapterKey);
        setTimeout(() => setSaved(null), 3000);
      }
    } catch {
      setError("Error de conexión.");
    } finally {
      setSaving(null);
    }
  }

  function updateChapter(key: string, field: "title" | "content", value: string) {
    setChapters((prev) =>
      prev.map((ch) =>
        ch.chapterKey === key ? { ...ch, [field]: value } : ch
      )
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-sm h-16">
        <div className="flex justify-between items-center h-16 px-8 w-full max-w-[1440px] mx-auto">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Image src="/logo-fucs.png" alt="FUCS" width={80} height={40} className="h-10 w-auto object-contain" />
              </Link>
              <div className="w-px h-8 bg-slate-200" />
              <span className="text-lg font-bold text-[#1E293B]">Tutor IA · Administrador</span>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <span className="text-[#14B8A6] font-semibold border-b-2 border-[#14B8A6] pb-1">
                Configuración
              </span>
              <Link href="/coordinador" className="text-slate-500 hover:text-[#1E293B] transition-all flex items-center gap-1.5">
                <Users size={14} />
                Ver coordinador
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-[#1E293B] leading-none">{userName}</p>
              <p className="text-xs text-slate-500 mt-0.5">Administrador</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#1E293B] flex items-center justify-center text-white">
              <User size={16} />
            </div>
            <button onClick={() => signOut({ callbackUrl: "/login" })} className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-12 px-8 max-w-[1440px] mx-auto space-y-6">
        {/* Title */}
        <div>
          <h1 className="text-3xl font-semibold text-[#1E293B]">Configuración administrativa</h1>
          <p className="text-[#45474c] text-sm mt-1">
            Gestión del contenido normativo que guía el comportamiento del Tutor IA.
          </p>
        </div>

        {/* Warning */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-amber-900 text-sm font-semibold">Advertencia importante</p>
            <p className="text-amber-800 text-xs mt-0.5">
              Este contenido guía el comportamiento del tutor IA. Los cambios afectan todas las sesiones futuras. No es visible para los estudiantes.
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-[#ffdad6] text-[#93000a] rounded-lg p-3 text-sm flex items-center gap-2">
            <AlertTriangle size={14} />
            {error}
          </div>
        )}

        {/* Chapters */}
        <div className="space-y-6">
          {chapters.map((chapter) => (
            <section
              key={chapter.chapterKey}
              className="bg-white rounded-xl border border-[#c5c6cd] shadow-sm overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-[#c5c6cd] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen size={18} className="text-[#14B8A6]" />
                  <div>
                    <h2 className="text-base font-semibold text-[#1E293B]">
                      {chapter.title}
                    </h2>
                    <p className="text-xs text-[#45474c]">
                      Última actualización: {formatDate(chapter.updatedAt)}
                    </p>
                  </div>
                </div>
                {saved === chapter.chapterKey && (
                  <div className="flex items-center gap-1.5 text-[#006b5f] text-xs font-medium">
                    <CheckCircle2 size={14} />
                    Guardado
                  </div>
                )}
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1E293B] mb-1.5">
                    Título del capítulo
                  </label>
                  <input
                    type="text"
                    value={chapter.title}
                    onChange={(e) => updateChapter(chapter.chapterKey, "title", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-[#c5c6cd] text-sm bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1E293B] mb-1.5">
                    Contenido normativo
                  </label>
                  <textarea
                    value={chapter.content}
                    onChange={(e) => updateChapter(chapter.chapterKey, "content", e.target.value)}
                    rows={14}
                    className="w-full px-4 py-3 rounded-lg border border-[#c5c6cd] text-sm bg-white text-[#1E293B] font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent transition-all resize-y"
                  />
                  <p className="text-xs text-[#75777d] mt-1">
                    {chapter.content.length} caracteres
                  </p>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => handleSave(chapter)}
                    disabled={saving === chapter.chapterKey}
                    className="flex items-center gap-2 bg-[#1E293B] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 active:scale-95 transition-all disabled:opacity-60"
                  >
                    {saving === chapter.chapterKey ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save size={14} />
                        Guardar cambios
                      </>
                    )}
                  </button>
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Info */}
        <div className="bg-[#f2f4f6] rounded-xl p-5 border border-[#c5c6cd]">
          <h3 className="text-sm font-semibold text-[#1E293B] mb-2">Sobre el contenido normativo</h3>
          <ul className="space-y-1.5 text-xs text-[#45474c]">
            <li className="flex items-start gap-2">
              <CheckCircle2 size={12} className="text-[#14B8A6] mt-0.5 flex-shrink-0" />
              El contenido se envía al modelo de IA como contexto en cada sesión de tutoría.
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={12} className="text-[#14B8A6] mt-0.5 flex-shrink-0" />
              Los cambios aplican a sesiones nuevas; las sesiones activas no se ven afectadas.
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={12} className="text-[#14B8A6] mt-0.5 flex-shrink-0" />
              El contenido no es visible para los estudiantes en ningún momento.
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
