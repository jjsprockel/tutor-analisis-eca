"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, BookOpen, AlertCircle, CheckCircle } from "lucide-react";

export default function RegistroPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "estudiante",
    academicLevel: "interno",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.email.endsWith("@fucsalud.edu.co")) {
      setError("Solo se aceptan correos con dominio @fucsalud.edu.co");
      return;
    }

    if (form.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
          academicLevel: form.academicLevel,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al crear la cuenta.");
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 2000);
      }
    } catch {
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#e0e3e5] shadow-sm p-8">
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
            <h1 className="text-xl font-bold text-[#1E293B]">Crear cuenta</h1>
          </div>
          <p className="text-sm text-[#45474c] text-center">
            Solo correos @fucsalud.edu.co
          </p>
        </div>

        {success ? (
          <div className="flex flex-col items-center gap-3 py-6">
            <CheckCircle size={48} className="text-[#14B8A6]" />
            <p className="text-[#1E293B] font-medium text-center">
              ¡Cuenta creada exitosamente!
            </p>
            <p className="text-sm text-[#45474c] text-center">
              Redirigiendo al inicio de sesión...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-3 bg-[#ffdad6] text-[#93000a] rounded-lg p-3 text-sm">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#1E293B] mb-1.5">
                Nombre completo
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ej. María García"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-[#c5c6cd] text-sm bg-white placeholder:text-[#75777d] focus:outline-none focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1E293B] mb-1.5">
                Correo institucional
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="usuario@fucsalud.edu.co"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-[#c5c6cd] text-sm bg-white placeholder:text-[#75777d] focus:outline-none focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-[#1E293B] mb-1.5">
                  Rol
                </label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-lg border border-[#c5c6cd] text-sm bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent transition-all"
                >
                  <option value="estudiante">Estudiante</option>
                  <option value="coordinador">Coordinador</option>
                  <option value="administrador">Administrador</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1E293B] mb-1.5">
                  Nivel académico
                </label>
                <select
                  name="academicLevel"
                  value={form.academicLevel}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-lg border border-[#c5c6cd] text-sm bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent transition-all"
                >
                  <option value="interno">Interno</option>
                  <option value="residente">Residente</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1E293B] mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Mínimo 8 caracteres"
                  required
                  minLength={8}
                  className="w-full px-4 py-2.5 pr-10 rounded-lg border border-[#c5c6cd] text-sm bg-white placeholder:text-[#75777d] focus:outline-none focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#75777d]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1E293B] mb-1.5">
                Confirmar contraseña
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Repite tu contraseña"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-[#c5c6cd] text-sm bg-white placeholder:text-[#75777d] focus:outline-none focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1E293B] text-white rounded-lg py-2.5 text-sm font-semibold hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 mt-2"
            >
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>
        )}

        {!success && (
          <p className="mt-5 text-center text-sm text-[#45474c]">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-[#14B8A6] font-medium hover:underline">
              Inicia sesión
            </Link>
          </p>
        )}
      </div>

      <p className="mt-6 text-xs text-[#75777d] text-center">
        © {new Date().getFullYear()} Universidad FUCS · Sistema de Tutoría Académica
      </p>
    </div>
  );
}
