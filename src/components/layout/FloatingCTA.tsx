import { siteConfig } from "@/data/site";

export function FloatingCTA() {
  return (
    <a
      href={`tel:${siteConfig.phonesTel[0]}`}
      className="fixed bottom-6 left-6 z-40 flex items-center gap-2 rounded-full bg-gold-500 px-5 py-3 text-sm font-bold text-navy-950 shadow-xl shadow-gold-500/40 transition hover:scale-105 hover:bg-gold-400"
      dir="ltr"
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        />
      </svg>
      تماس فوری
    </a>
  );
}
