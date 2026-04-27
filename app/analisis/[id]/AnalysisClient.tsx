"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  Send,
  Lightbulb,
  ChevronsRight,
  Pause,
  Check,
  Lock,
  Bot,
  User as UserIcon,
  LogOut,
  AlertCircle,
  FileText,
} from "lucide-react";
import { STAGES } from "@/lib/ai/rctTutorPrompt";

// Inline markdown renderer: **bold**, *italic*, newlines
function parseInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*\n]+\*\*|\*[^*\n]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*"))
      return <em key={i}>{part.slice(1, -1)}</em>;
    return part;
  });
}

function TutorBubble({ content }: { content: string }) {
  const paragraphs = content.split(/\n\n+/);
  return (
    <div className="space-y-2">
      {paragraphs.map((para, pi) => {
        const lines = para.split("\n");
        return (
          <p key={pi}>
            {lines.map((line, li) => (
              <span key={li}>
                {li > 0 && <br />}
                {parseInline(line)}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

interface Message {
  id: string;
  role: string;
  content: string;
  stage: number;
  createdAt: string;
}

interface Props {
  sessionId: string;
  articleId: string;
  currentStage: number;
  articleTitle: string;
  sessionStatus: string;
  initialMessages: Message[];
}

export default function AnalysisClient({
  sessionId,
  articleId,
  currentStage: initialStage,
  articleTitle,
  sessionStatus,
  initialMessages,
}: Props) {
  const router = useRouter();
  const [stage, setStage] = useState(initialStage);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatError, setChatError] = useState("");
  const [pausing, setPausing] = useState(false);
  const [pdfError, setPdfError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Suppress unused warning
  void sessionStatus;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(
    async (content: string, opts: { hint?: boolean; explain?: boolean } = {}) => {
      if (loading) return;
      setLoading(true);
      setChatError("");
      setInput("");

      const displayContent = opts.hint
        ? "Dame una pista sobre este tema."
        : opts.explain
        ? "Explica esto y continúa."
        : content;

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "student",
          content: displayContent,
          stage,
          createdAt: new Date().toISOString(),
        },
      ]);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 40_000);

      try {
        const res = await fetch(`/api/sesion/${sessionId}/mensaje`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content,
            requestHint: opts.hint ?? false,
            requestExplain: opts.explain ?? false,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          setChatError(err.error || "El tutor no pudo responder. Intenta de nuevo.");
          return;
        }

        const data = await res.json();

        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "tutor",
            content: data.message,
            stage: data.stage,
            createdAt: new Date().toISOString(),
          },
        ]);
        setStage(data.stage);

        if (data.completed) {
          await fetch(`/api/sesion/${sessionId}/feedback`, { method: "POST" });
          router.push(`/sesion/${sessionId}/feedback`);
        }
      } catch (err: unknown) {
        clearTimeout(timeoutId);
        if (err instanceof Error && err.name === "AbortError") {
          setChatError("La respuesta tardó demasiado. Intenta de nuevo.");
        } else {
          setChatError("Error de conexión. Verifica tu red e intenta de nuevo.");
        }
      } finally {
        setLoading(false);
      }
    },
    [loading, sessionId, stage, router]
  );

  async function handlePause() {
    setPausing(true);
    await fetch(`/api/sesion/${sessionId}/estado`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "paused" }),
    }).catch(() => null);
    router.push("/dashboard");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) sendMessage(input.trim());
    }
  }

  const currentStageName = STAGES.find((s) => s.id === stage)?.name || `Etapa ${stage}`;
  const pdfUrl = `/api/articulo/${articleId}`;

  return (
    <div className="flex flex-col h-screen bg-[#f7f9fb] overflow-hidden">
      {/* Top Nav */}
      <header className="flex-shrink-0 bg-white border-b border-slate-200 shadow-sm h-14 z-50">
        <div className="flex justify-between items-center h-14 px-6 w-full max-w-[1440px] mx-auto">
          <div className="flex items-center gap-5">
            <Link href="/dashboard">
              <Image src="/logo-fucs.png" alt="FUCS" width={60} height={30} className="h-8 w-auto object-contain" />
            </Link>
            <div className="w-px h-6 bg-slate-200" />
            <div>
              <p className="text-sm font-semibold text-[#1E293B] leading-none truncate max-w-xs">
                {articleTitle}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Análisis en curso</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePause}
              disabled={pausing}
              className="flex items-center gap-1.5 text-xs font-medium text-[#45474c] border border-[#c5c6cd] px-3 py-1.5 rounded-lg hover:bg-[#f2f4f6] transition-all disabled:opacity-60"
            >
              <Pause size={13} />
              Pausar sesión
            </button>
            <div className="w-8 h-8 rounded-full bg-[#1E293B] flex items-center justify-center text-white">
              <UserIcon size={14} />
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Main workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* PDF Viewer */}
        <section className="flex-1 flex flex-col min-w-0 p-3">
          <div className="bg-white rounded-xl border border-[#c5c6cd] shadow-sm flex flex-col h-full overflow-hidden">
            {/* PDF toolbar */}
            <div className="px-4 py-2.5 border-b border-[#c5c6cd] flex items-center gap-3 bg-[#f7f9fb] flex-shrink-0">
              <FileText size={15} className="text-[#45474c]" />
              <span className="text-sm font-medium text-[#1E293B] truncate flex-1">
                {articleTitle}
              </span>
              <span className="text-xs text-[#75777d] bg-[#eceef0] px-2 py-0.5 rounded">PDF</span>
            </div>

            {/* PDF iframe */}
            {pdfError ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 text-[#45474c] p-8">
                <FileText size={40} className="text-[#c5c6cd]" />
                <p className="text-sm font-medium text-[#1E293B]">Vista previa no disponible</p>
                <p className="text-xs text-center max-w-xs">
                  El archivo PDF no se pudo cargar en el visor. El análisis puede continuar normalmente con el tutor IA.
                </p>
              </div>
            ) : (
              <iframe
                src={pdfUrl}
                className="flex-1 w-full border-0"
                title={articleTitle}
                onError={() => setPdfError(true)}
              />
            )}
          </div>
        </section>

        {/* AI Tutor Chat Panel */}
        <aside className="w-[520px] flex flex-col border-l border-[#c5c6cd] bg-white shadow-lg flex-shrink-0">
          {/* Chat header */}
          <div className="px-4 py-3 border-b border-[#c5c6cd] bg-[#f7f9fb] flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-[#1E293B] flex items-center justify-center text-[#4fdbc8] flex-shrink-0">
              <Bot size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-[#1E293B]">Tutor IA</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6]" />
                <span className="text-[10px] text-[#45474c] font-medium uppercase tracking-wider truncate">
                  {currentStageName}
                </span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col gap-1 ${msg.role === "student" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[92%] px-4 py-3 rounded-2xl text-[15px] leading-relaxed ${
                    msg.role === "student"
                      ? "bg-[#1E293B] text-white rounded-tr-none"
                      : "bg-[#f2f4f6] text-[#1E293B] rounded-tl-none border border-[#e6e8ea]"
                  }`}
                >
                  {msg.role === "tutor" ? (
                    <TutorBubble content={msg.content} />
                  ) : (
                    msg.content
                  )}
                </div>
                <span className="text-[10px] text-[#75777d] px-1">Etapa {msg.stage}</span>
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div className="flex flex-col items-start gap-1">
                <div className="bg-[#f2f4f6] border border-[#e6e8ea] rounded-2xl rounded-tl-none px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-[#14B8A6] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-[#14B8A6] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-[#14B8A6] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            {/* Error message */}
            {chatError && (
              <div className="flex items-start gap-2 bg-[#ffdad6]/60 text-[#93000a] rounded-xl p-3 text-xs border border-[#ffdad6]">
                <AlertCircle size={13} className="mt-0.5 flex-shrink-0" />
                <span>{chatError}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="p-4 border-t border-[#c5c6cd] space-y-3 flex-shrink-0">
            <div className="flex gap-2">
              <button
                onClick={() => sendMessage("", { hint: true })}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium px-3 py-2 border border-[#c5c6cd] rounded-full text-[#45474c] hover:bg-[#f2f4f6] transition-all disabled:opacity-50"
              >
                <Lightbulb size={12} />
                Necesito una pista
              </button>
              <button
                onClick={() => sendMessage("", { explain: true })}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold px-3 py-2 bg-[#6df5e1] text-[#005048] rounded-full hover:opacity-90 transition-all disabled:opacity-50"
              >
                <ChevronsRight size={12} />
                Ver respuesta y continuar
              </button>
            </div>

            <div className="relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu respuesta… (Enter para enviar)"
                rows={3}
                disabled={loading}
                className="w-full bg-white border border-[#c5c6cd] rounded-xl px-4 py-3 pr-12 text-[15px] text-[#1E293B] placeholder:text-[#75777d] focus:outline-none focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent resize-none transition-all disabled:opacity-60"
              />
              <button
                onClick={() => input.trim() && sendMessage(input.trim())}
                disabled={loading || !input.trim()}
                className="absolute bottom-3 right-3 bg-[#1E293B] text-white p-2 rounded-lg hover:opacity-90 transition-all disabled:opacity-40"
              >
                <Send size={14} />
              </button>
            </div>
            <p className="text-[10px] text-[#75777d] text-center italic">
              El Tutor IA puede cometer errores. Verifica los datos críticos.
            </p>
          </div>
        </aside>
      </div>

      {/* Bottom Progress Bar */}
      <footer className="flex-shrink-0 h-20 bg-white border-t border-[#c5c6cd] px-6 flex items-center overflow-x-auto hide-scrollbar shadow-sm">
        <div className="flex items-center w-full max-w-[1440px] mx-auto justify-between gap-2 min-w-max">
          {STAGES.map((s, i) => {
            const isCompleted = s.id < stage;
            const isActive = s.id === stage;

            return (
              <div key={s.id} className="flex items-center">
                <div className="flex flex-col items-center gap-1 min-w-max">
                  <div
                    className={`flex items-center justify-center rounded-full shadow-sm transition-all ${
                      isCompleted
                        ? "w-7 h-7 bg-[#14B8A6] text-white"
                        : isActive
                        ? "w-8 h-8 bg-[#1E293B] text-[#4fdbc8] ring-2 ring-[#4fdbc8]/50"
                        : "w-6 h-6 border-2 border-[#c5c6cd] text-[#75777d]"
                    }`}
                  >
                    {isCompleted ? (
                      <Check size={12} strokeWidth={3} />
                    ) : !isActive ? (
                      <Lock size={9} />
                    ) : (
                      <span className="text-[10px] font-bold">{s.id}</span>
                    )}
                  </div>
                  <span
                    className={`text-[9px] font-medium max-w-[60px] text-center leading-tight ${
                      isActive ? "text-[#1E293B] font-bold" : isCompleted ? "text-[#006b5f]" : "text-[#75777d]"
                    }`}
                  >
                    {s.name}
                  </span>
                </div>

                {i < STAGES.length - 1 && (
                  <div className={`h-0.5 w-5 mx-1 transition-all ${s.id < stage ? "bg-[#14B8A6]" : "bg-[#c5c6cd]"}`} />
                )}
              </div>
            );
          })}
        </div>
      </footer>
    </div>
  );
}
