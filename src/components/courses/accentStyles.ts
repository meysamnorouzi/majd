import type { CourseFormat } from "@/types";

export const accentMap = {
  gold: {
    badge: "bg-gold-500/20 text-gold-400 border-gold-500/30",
    icon: "bg-gold-500 text-navy-950",
    ring: "ring-gold-500/30",
    gradient: "from-gold-500/20 to-transparent",
    dot: "bg-gold-400",
  },
  blue: {
    badge: "bg-sky-500/20 text-sky-300 border-sky-500/30",
    icon: "bg-sky-500 text-white",
    ring: "ring-sky-500/30",
    gradient: "from-sky-500/20 to-transparent",
    dot: "bg-sky-400",
  },
  emerald: {
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    icon: "bg-emerald-500 text-white",
    ring: "ring-emerald-500/30",
    gradient: "from-emerald-500/20 to-transparent",
    dot: "bg-emerald-400",
  },
  violet: {
    badge: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    icon: "bg-violet-500 text-white",
    ring: "ring-violet-500/30",
    gradient: "from-violet-500/20 to-transparent",
    dot: "bg-violet-400",
  },
  amber: {
    badge: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    icon: "bg-amber-500 text-navy-950",
    ring: "ring-amber-500/30",
    gradient: "from-amber-500/20 to-transparent",
    dot: "bg-amber-400",
  },
} as const;

export function getAccent(format: CourseFormat) {
  return accentMap[format.accent];
}
