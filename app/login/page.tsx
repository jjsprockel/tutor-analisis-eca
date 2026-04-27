"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, BookOpen, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email.endsWith("@fucsalud.edu.co")) {
      setError("Solo se aceptan correos con dominio @fucsalud.edu.co");
      setLoading(false);
      return;
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Correo o contraseña incorrectos.");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col items-center justify-center px-4">
      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#e0e3e5] shadow-sm p-8">
        {/* Logo + título */}
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/logo-fucs.png"
            alt="Universidad FUCS"
            width={120}
            height={60}
            className="h-14 w-auto object-contain mb-4"
            priority
          />
          <div className="flex items-center gap-2 mb-1">
            <BookOpen size={18} className="text-[#14B8A6]" />
            <h1 className="text-xl font-bold text-[#1E293B]">Tutor IA · ECA</h1>
          </div>
          <p className="text-sm text-[#45474c] text-center">
            Lectura crítica de ensayos clínicos aleatorizados
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex items-start gap-3 bg-[#ffdad6] text-[#93000a] rounded-lg p-3 text-sm">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#1E293B] mb-1.5">
              Correo institucional
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@fucsalud.edu.co"
              required
              className="w-full px-4 py-2.5 rounded-lg border border-[#c5c6cd] text-sm bg-white placeholder:text-[#75777d] focus:outline-none focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1E293B] mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2.5 pr-10 rounded-lg border border-[#c5c6cd] text-sm bg-white placeholder:text-[#75777d] focus:outline-none focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#75777d] hover:text-[#45474c]"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1E293B] text-white rounded-lg py-2.5 text-sm font-semibold hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Verificando..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#45474c]">
          ¿No tienes cuenta?{" "}
          <Link href="/registro" className="text-[#14B8A6] font-medium hover:underline">
            Regístrate
          </Link>
        </p>

        <p className="mt-3 text-center text-xs text-[#75777d]">
          Solo correos @fucsalud.edu.co son aceptados
        </p>
        <p className="mt-4 text-center text-xs text-[#75777d]">
          <Link href="/acerca" className="text-[#14B8A6] hover:underline">
            Acerca del aplicativo
          </Link>
          {" · "}
          <Link href="/quienes-somos" className="text-[#14B8A6] hover:underline">
            Quiénes somos
          </Link>
        </p>

        {/* Demo credentials */}
        <div className="mt-6 border-t border-[#e0e3e5] pt-5">
          <p className="text-xs font-semibold text-[#75777d] uppercase tracking-wider mb-3 text-center">
            Cuentas de prueba
          </p>
          <div className="space-y-2">
            {[
              { label: "Estudiante", email: "estudiante@fucsalud.edu.co", password: "test1234" },
              { label: "Coordinador", email: "coordinador@fucsalud.edu.co", password: "test1234" },
            ].map((demo) => (
              <button
                key={demo.label}
                type="button"
                onClick={() => { setEmail(demo.email); setPassword(demo.password); }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border border-[#e0e3e5] bg-[#f7f9fb] hover:bg-[#eceef0] transition-colors text-left group"
              >
                <div>
                  <span className="text-xs font-semibold text-[#1E293B] block">{demo.label}</span>
                  <span className="text-xs text-[#45474c]">{demo.email}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#75777d] font-mono">{demo.password}</span>
                  <span className="text-[10px] text-[#14B8A6] block opacity-0 group-hover:opacity-100 transition-opacity">
                    clic para usar
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-6 text-xs text-[#75777d] text-center">
        © {new Date().getFullYear()} Universidad FUCS · Sistema de Tutoría Académica
      </p>
    </div>
  );
}
