"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  CheckCircle2,
  Microscope,
  BarChart2,
  Stethoscope,
  Globe,
  ThumbsUp,
  AlertCircle,
  Shield,
  Star,
  MapPin,
  User,
  LogOut,
  ArrowLeft,
} from "lucide-react";

interface FeedbackData {
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

interface Props {
  sessionId: string;
  articleTitle: string;
  feedback: FeedbackData;
}

export default function FeedbackClient({ articleTitle, feedback }: Props) {
  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      {/* Top Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-sm h-16">
        <div className="flex justify-between items-center h-16 px-8 w-full max-w-[1440px] mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Image src="/logo-fucs.png" alt="FUCS" width={80} height={40} className="h-10 w-auto object-contain" />
            </Link>
            <div className="w-px h-8 bg-slate-200" />
            <span className="text-lg font-bold tracking-tight text-[#1E293B]">Tutor IA · ECA</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1E293B] flex items-center justify-center text-white">
              <User size={16} />
            </div>
            <button onClick={() => signOut({ callbackUrl: "/login" })} className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16 px-8 max-w-[1024px] mx-auto">
        {/* Header */}
        <section className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#6df5e1] text-[#005048] rounded-full mb-4">
            <CheckCircle2 size={14} strokeWidth={3} />
            <span className="text-xs font-bold uppercase tracking-wider">Análisis Completado</span>
          </div>
          <h1 className="text-3xl font-semibold text-[#1E293B] tracking-tight mb-2 max-w-3xl mx-auto leading-snug">
            {articleTitle}
          </h1>
          <p className="text-[#45474c] text-sm max-w-xl mx-auto">
            Retroalimentación cualitativa final generada por el Tutor IA basada en tu análisis crítico del ensayo clínico.
          </p>
        </section>

        {/* 4 feedback cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {[
            {
              icon: Microscope,
              label: "Comprensión metodológica",
              content: feedback.methodologicalComprehension,
            },
            {
              icon: BarChart2,
              label: "Interpretación estadística",
              content: feedback.statisticalInterpretation,
            },
            {
              icon: Stethoscope,
              label: "Juicio clínico",
              content: feedback.clinicalJudgment,
            },
            {
              icon: Globe,
              label: "Aplicabilidad",
              content: feedback.applicability,
            },
          ].map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-xl border border-[#c5c6cd] shadow-sm p-5 hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 bg-[#f2f4f6] rounded-lg flex items-center justify-center mb-3">
                <card.icon size={18} className="text-[#14B8A6]" />
              </div>
              <h3 className="text-sm font-semibold text-[#1E293B] mb-2">{card.label}</h3>
              <p className="text-xs text-[#45474c] leading-relaxed">{card.content}</p>
            </div>
          ))}
        </div>

        {/* Strengths + Difficulties */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Strengths */}
          <div className="bg-white rounded-xl border border-[#c5c6cd] shadow-sm overflow-hidden">
            <div className="bg-[#f2f4f6] px-5 py-3 border-b border-[#c5c6cd]">
              <h2 className="text-base font-semibold text-[#1E293B] flex items-center gap-2">
                <ThumbsUp size={16} className="text-[#14B8A6]" />
                Fortalezas principales
              </h2>
            </div>
            <div className="p-5">
              <ul className="space-y-3">
                {(feedback.strengths || []).map((s, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={15} className="text-[#14B8A6] mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-[#45474c] leading-relaxed">{s}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Difficulties */}
          <div className="bg-white rounded-xl border border-[#c5c6cd] shadow-sm overflow-hidden">
            <div className="bg-[#f2f4f6] px-5 py-3 border-b border-[#c5c6cd]">
              <h2 className="text-base font-semibold text-[#1E293B] flex items-center gap-2">
                <AlertCircle size={16} className="text-amber-500" />
                Dificultades detectadas
              </h2>
            </div>
            <div className="p-5">
              <ul className="space-y-3">
                {(feedback.difficulties || []).map((d, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <AlertCircle size={15} className="text-amber-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-[#45474c] leading-relaxed">{d}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Final judgment */}
        <div className="bg-[#1E293B] rounded-xl p-7 text-white mb-8 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-lg font-semibold mb-6">Juicio final del Tutor IA</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { icon: Shield, label: "Validez", content: feedback.validityJudgment },
                { icon: Star, label: "Importancia", content: feedback.importanceJudgment },
                { icon: MapPin, label: "Aplicabilidad", content: feedback.applicabilityJudgment },
              ].map((item) => (
                <div key={item.label} className="bg-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <item.icon size={15} className="text-[#4fdbc8]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#4fdbc8]">
                      {item.label}
                    </span>
                  </div>
                  <p className="text-sm text-[#e0e3e5] leading-relaxed">{item.content}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-[#14B8A6] opacity-10 rounded-full blur-3xl" />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 bg-[#1E293B] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 active:scale-95 transition-all"
          >
            <ArrowLeft size={16} />
            Volver al dashboard
          </Link>
          <Link
            href="/analisis/nuevo"
            className="flex items-center gap-2 border border-[#c5c6cd] text-[#1E293B] px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#f2f4f6] transition-all"
          >
            Analizar otro artículo
          </Link>
        </div>

        {/* Disclaimer */}
        <p className="mt-8 text-center text-xs text-[#75777d] italic">
          Esta retroalimentación es generada por inteligencia artificial con fines pedagógicos.
          No reemplaza la evaluación de un docente. No se emite ninguna calificación numérica.
        </p>
      </main>
    </div>
  );
}
