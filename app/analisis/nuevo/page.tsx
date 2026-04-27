"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronRight,
  Loader2,
  User,
  LogOut,
} from "lucide-react";

interface ValidationResult {
  id: string;
  isRCT: boolean;
  title: string;
  extractionLimited: boolean;
  reason?: string;
  metadata: {
    studyType?: string;
    designType?: string;
    intervention?: string;
    comparator?: string;
    randomization?: string;
    blinding?: string;
    primaryOutcome?: string;
  };
}

type Step = "upload" | "processing" | "result";

export default function NuevoAnalisisPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [creatingSession, setCreatingSession] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) validateAndUpload(f);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) validateAndUpload(f);
  }

  async function validateAndUpload(f: File) {
    setError("");
    if (!f.name.endsWith(".pdf") && f.type !== "application/pdf") {
      setError("Solo se aceptan archivos PDF.");
      return;
    }
    if (f.size > 25 * 1024 * 1024) {
      setError("El archivo supera el límite de 25MB.");
      return;
    }
    setFile(f);
    await uploadFile(f);
  }

  async function uploadFile(f: File) {
    setStep("processing");
    setError("");

    const formData = new FormData();
    formData.append("pdf", f);

    try {
      const res = await fetch("/api/articulo", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error procesando el archivo.");
        setStep("upload");
        return;
      }

      setResult(data);

      if (data.isRCT) {
        await startSession(data.id);
      } else {
        setStep("result");
      }
    } catch {
      setError("Error de conexión. Intenta nuevamente.");
      setStep("upload");
    }
  }

  async function startSession(articleId: string) {
    setCreatingSession(true);

    try {
      const res = await fetch("/api/sesion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error creando la sesión.");
        setCreatingSession(false);
        setStep("result");
        return;
      }

      router.push(`/analisis/${data.sessionId}`);
    } catch {
      setError("Error al iniciar la sesión.");
      setCreatingSession(false);
      setStep("result");
    }
  }

  async function handleStartSession() {
    if (!result) return;
    await startSession(result.id);
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      {/* Top Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-sm h-16">
        <div className="flex justify-between items-center h-16 px-8 w-full max-w-[1440px] mx-auto">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Image src="/logo-fucs.png" alt="FUCS" width={80} height={40} className="h-10 w-auto object-contain" priority />
              </Link>
              <div className="w-px h-8 bg-slate-200" />
              <span className="text-lg font-bold tracking-tight text-[#1E293B]">Tutor IA · ECA</span>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link href="/dashboard" className="text-slate-500 hover:text-[#1E293B] transition-all">Dashboard</Link>
              <span className="text-[#14B8A6] font-semibold border-b-2 border-[#14B8A6] pb-1">Nuevo Análisis</span>
            </nav>
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

      <main className="pt-24 pb-12 px-8 max-w-[1440px] mx-auto">
        <div className="max-w-2xl mx-auto">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-[#1E293B] tracking-tight">
              Verificación de Artículo
            </h1>
            <p className="text-[#45474c] mt-1 text-sm">
              Suba el archivo PDF del ensayo clínico para iniciar el proceso de validación automatizada.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 flex items-start gap-3 bg-[#ffdad6] text-[#93000a] rounded-lg p-4 text-sm border border-[#93000a]/20">
              <XCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Step: Upload */}
          {step === "upload" && (
            <div className="space-y-6">
              {/* Drop zone */}
              <div
                className={`bg-white border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center space-y-4 transition-colors cursor-pointer ${
                  dragOver ? "border-[#14B8A6] bg-[#6df5e1]/10" : "border-[#c5c6cd] hover:border-[#14B8A6]"
                }`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-transform ${dragOver ? "scale-110" : ""} bg-[#f2f4f6]`}>
                  <UploadCloud size={28} className="text-[#1E293B]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-medium text-[#1E293B]">
                    {file ? file.name : "Carga un ensayo clínico aleatorizado..."}
                  </h3>
                  <p className="text-[#45474c] text-sm">
                    {file
                      ? `${(file.size / 1024 / 1024).toFixed(2)} MB · PDF`
                      : "Arrastra aquí o haz clic · Solo PDF · Máx. 25MB"}
                  </p>
                </div>
                {file && (
                  <div className="flex items-center gap-2 text-[#14B8A6] text-sm font-medium">
                    <FileText size={16} />
                    Archivo seleccionado
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {/* Info card */}
              <div className="bg-[#f2f4f6] rounded-xl p-5 border border-[#c5c6cd]">
                <h4 className="text-sm font-semibold text-[#1E293B] mb-3">¿Qué ocurre al subir el PDF?</h4>
                <ul className="space-y-2 text-sm text-[#45474c]">
                  {[
                    "El sistema extrae el texto del artículo.",
                    "La IA verifica si corresponde a un ECA.",
                    "Si es válido, se muestra la tarjeta de compatibilidad.",
                    "Si no es un ECA, se informa el motivo y puedes subir otro.",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-[#14B8A6] mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Step: Processing */}
          {step === "processing" && (
            <div className="bg-white rounded-xl border border-[#c5c6cd] shadow-sm p-12 flex flex-col items-center gap-6 text-center">
              <Loader2 size={40} className="text-[#14B8A6] animate-spin" />
              <div>
                <h3 className="text-lg font-semibold text-[#1E293B]">
                  {creatingSession ? "Iniciando sesión de análisis..." : "Verificando artículo..."}
                </h3>
                <p className="text-sm text-[#45474c] mt-1">
                  {creatingSession
                    ? "El artículo es compatible. Preparando el tutor IA..."
                    : "Extrayendo texto y verificando si corresponde a un ECA."}
                </p>
              </div>
              <div className="w-full max-w-xs bg-[#f2f4f6] rounded-full h-1.5">
                <div className="bg-[#14B8A6] h-1.5 rounded-full animate-pulse" style={{ width: "60%" }} />
              </div>
              <p className="text-xs text-[#75777d]">Esto puede tardar unos segundos...</p>
            </div>
          )}

          {/* Step: Result */}
          {step === "result" && result && (
            <div className="space-y-6">
              {/* Extraction warning */}
              {result.extractionLimited && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertTriangle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-amber-900 text-sm font-medium">Extracción Limitada Detectada</p>
                    <p className="text-amber-800 text-xs mt-1">
                      El PDF presenta limitaciones de extracción. El análisis continuará con restricciones explícitas.
                    </p>
                  </div>
                </div>
              )}

              {result.isRCT ? (
                /* Compatible article card */
                <div className="bg-white rounded-xl border border-[#c5c6cd] shadow-sm overflow-hidden">
                  <div className="bg-[#1E293B] p-5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#14B8A6] flex items-center justify-center">
                      <CheckCircle2 size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Artículo compatible</h3>
                      <p className="text-[#8590a6] text-xs">Verificación exitosa</p>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-[#45474c] uppercase tracking-wider mb-1">Título detectado</p>
                      <p className="text-sm text-[#1E293B] font-medium">{result.title}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: "Tipo de estudio", value: result.metadata.studyType || "Ensayo clínico aleatorizado" },
                        { label: "Diseño", value: result.metadata.designType || "No reportado" },
                        { label: "Intervención", value: result.metadata.intervention || "No detectada" },
                        { label: "Comparador", value: result.metadata.comparator || "No detectado" },
                        { label: "Aleatorización", value: result.metadata.randomization || "No reportada" },
                        { label: "Cegamiento", value: result.metadata.blinding || "No reportado" },
                      ].map((item) => (
                        <div key={item.label} className="bg-[#f2f4f6] rounded-lg p-3">
                          <p className="text-[10px] font-semibold text-[#75777d] uppercase tracking-wider mb-1">
                            {item.label}
                          </p>
                          <p className="text-xs text-[#1E293B] font-medium leading-snug">
                            {item.value}
                          </p>
                        </div>
                      ))}
                    </div>
                    {result.metadata.primaryOutcome && (
                      <div className="bg-[#6df5e1]/20 rounded-lg p-3 border border-[#14B8A6]/20">
                        <p className="text-[10px] font-semibold text-[#45474c] uppercase tracking-wider mb-1">
                          Desenlace primario
                        </p>
                        <p className="text-xs text-[#1E293B]">{result.metadata.primaryOutcome}</p>
                      </div>
                    )}

                    <button
                      onClick={handleStartSession}
                      disabled={creatingSession}
                      className="w-full bg-[#1E293B] text-white rounded-lg py-3 text-sm font-semibold hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
                    >
                      {creatingSession ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Iniciando sesión...
                        </>
                      ) : (
                        <>
                          Iniciar análisis guiado
                          <ChevronRight size={16} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                /* Rejected article */
                <div className="bg-white rounded-xl border border-[#c5c6cd] shadow-sm p-8 flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#ffdad6] flex items-center justify-center">
                    <XCircle size={28} className="text-[#93000a]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#1E293B]">
                      Artículo no compatible
                    </h3>
                    <p className="text-sm text-[#45474c] mt-1 max-w-md">
                      {result.reason ||
                        "El artículo no corresponde a un ensayo clínico aleatorizado. Solo se aceptan ECA para el análisis guiado."}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setStep("upload");
                      setFile(null);
                      setResult(null);
                      setError("");
                    }}
                    className="bg-[#1E293B] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 active:scale-95 transition-all"
                  >
                    Subir otro artículo
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
