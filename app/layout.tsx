import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tutor IA · Lectura Crítica de ECA | Universidad FUCS",
  description:
    "Plataforma de tutoría inteligente para el análisis crítico de ensayos clínicos aleatorizados.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.className} h-full`}>
      <body className="min-h-full flex flex-col bg-[#f7f9fb] text-[#191c1e]">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
