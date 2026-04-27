"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  Users,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  User,
  LogOut,
} from "lucide-react";
import { formatDuration } from "@/lib/utils";

interface StudentStat {
  id: string;
  name: string;
  email: string;
  academicLevel: string;
  totalSessions: number;
  completedSessions: number;
  avgProgress: number;
  totalTime: number;
  topDifficulty: string | null;
}

interface Props {
  userName: string;
  summary: {
    totalStudents: number;
    totalSessions: number;
    completedSessions: number;
    topDifficulty: string | null;
  };
  students: StudentStat[];
}

export default function CoordinadorClient({ userName, summary, students }: Props) {
  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-sm h-16">
        <div className="flex justify-between items-center h-16 px-8 w-full max-w-[1440px] mx-auto">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
              <Link href="/coordinador">
                <Image src="/logo-fucs.png" alt="FUCS" width={80} height={40} className="h-10 w-auto object-contain" />
              </Link>
              <div className="w-px h-8 bg-slate-200" />
              <span className="text-lg font-bold text-[#1E293B]">Tutor IA · Coordinador</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-[#1E293B] leading-none">{userName}</p>
              <p className="text-xs text-slate-500 mt-0.5">Coordinador</p>
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
          <h1 className="text-3xl font-semibold text-[#1E293B]">Dashboard Coordinador</h1>
          <p className="text-[#45474c] text-sm mt-1">Resumen agregado del progreso académico de los estudiantes.</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: Users, label: "Total estudiantes", value: summary.totalStudents },
            { icon: BookOpen, label: "Total sesiones", value: summary.totalSessions },
            { icon: CheckCircle, label: "Análisis completados", value: summary.completedSessions },
            {
              icon: AlertTriangle,
              label: "Dificultad más frecuente",
              value: summary.topDifficulty ? summary.topDifficulty.substring(0, 25) + "..." : "Sin datos",
              isText: true,
            },
          ].map((card) => (
            <div key={card.label} className="bg-white p-5 rounded-xl border border-[#c5c6cd] shadow-sm">
              <card.icon size={20} className="text-[#14B8A6] mb-2" />
              <p className="text-2xl font-semibold text-[#1E293B]">
                {card.isText ? (
                  <span className="text-sm leading-snug">{card.value}</span>
                ) : (
                  card.value
                )}
              </p>
              <p className="text-xs text-[#45474c] font-medium uppercase tracking-wider mt-1">
                {card.label}
              </p>
            </div>
          ))}
        </div>

        {/* Students table */}
        <section className="bg-white rounded-xl border border-[#c5c6cd] shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#c5c6cd]">
            <h2 className="text-lg font-semibold text-[#1E293B]">Progreso por estudiante</h2>
            <p className="text-xs text-[#45474c] mt-0.5">
              Se muestran datos agregados. No se incluyen transcripciones ni respuestas individuales.
            </p>
          </div>
          {students.length === 0 ? (
            <div className="p-12 text-center text-[#45474c]">
              <Users size={40} className="mx-auto mb-3 text-[#c5c6cd]" />
              <p className="text-sm">Aún no hay estudiantes registrados.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#f2f4f6] border-b border-[#c5c6cd]">
                  <tr>
                    {["Estudiante", "Correo", "Nivel", "Sesiones", "Completadas", "Avance prom.", "Tiempo total", "Dificultad principal"].map(
                      (h) => (
                        <th key={h} className="p-4 text-xs font-semibold text-[#45474c] uppercase tracking-wider whitespace-nowrap">
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e6e8ea]">
                  {students.map((s) => (
                    <tr key={s.id} className="hover:bg-[#f7f9fb] transition-colors">
                      <td className="p-4 text-sm font-medium text-[#1E293B]">{s.name}</td>
                      <td className="p-4 text-sm text-[#45474c]">{s.email}</td>
                      <td className="p-4">
                        <span className="text-xs font-medium capitalize text-[#45474c]">{s.academicLevel}</span>
                      </td>
                      <td className="p-4 text-sm text-[#1E293B] text-center">{s.totalSessions}</td>
                      <td className="p-4 text-sm text-[#1E293B] text-center">{s.completedSessions}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-[#f2f4f6] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#14B8A6] rounded-full"
                              style={{ width: `${s.avgProgress}%` }}
                            />
                          </div>
                          <span className="text-xs text-[#45474c]">{s.avgProgress}%</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-[#45474c]">
                        {s.totalTime > 0 ? formatDuration(s.totalTime) : "—"}
                      </td>
                      <td className="p-4 text-xs text-[#45474c] max-w-xs">
                        <span className="block truncate">{s.topDifficulty || "—"}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
