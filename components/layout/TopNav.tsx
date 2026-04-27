"use client";

import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopNavProps {
  userName?: string;
  userRole?: string;
  activeTab?: string;
}

export default function TopNav({ userName, userRole, activeTab }: TopNavProps) {
  const pathname = usePathname();

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", key: "dashboard" },
    { href: "/analisis/nuevo", label: "Nuevo Análisis", key: "analisis" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-sm h-16">
      <div className="flex justify-between items-center h-16 px-8 w-full max-w-[1440px] mx-auto">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-3">
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
            {navLinks.map((link) => {
              const isActive =
                activeTab === link.key || pathname.startsWith(link.href);
              return (
                <Link
                  key={link.key}
                  href={link.href}
                  className={cn(
                    "transition-all",
                    isActive
                      ? "text-[#14B8A6] font-semibold border-b-2 border-[#14B8A6] pb-1"
                      : "text-slate-500 hover:text-[#1E293B]"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {userName && (
            <div className="text-right mr-1 hidden sm:block">
              <p className="text-sm font-medium text-[#1E293B] leading-none">
                {userName}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{userRole}</p>
            </div>
          )}

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
  );
}
