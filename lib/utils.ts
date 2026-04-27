import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export const STATUS_LABELS: Record<string, string> = {
  active: "Activa",
  paused: "Pausada",
  completed: "Completada",
  rejected: "Rechazada",
};

export const STATUS_COLORS: Record<string, string> = {
  active: "bg-[#6df5e1] text-[#005048]",
  paused: "bg-[#e6e8ea] text-[#45474c]",
  completed: "bg-[#6df5e1] text-[#006b5f]",
  rejected: "bg-[#ffdad6] text-[#93000a]",
};
