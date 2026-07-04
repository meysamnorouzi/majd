import Link from "next/link";
import { siteConfig } from "@/data/site";

export function ServiceDetailActions() {
  return (
    <div className="flex flex-wrap gap-3">
      <a
        href="#consultation"
        className="inline-flex items-center gap-2 rounded-lg bg-gold-500 px-6 py-3 text-sm font-semibold text-navy-950 transition hover:bg-gold-400"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        درخواست مشاوره
      </a>
      <a
        href={`tel:${siteConfig.phonesTel[0]}`}
        className="inline-flex items-center gap-2 rounded-lg border-2 border-navy-900/20 bg-white px-6 py-3 text-sm font-semibold text-navy-900 transition hover:border-gold-400 hover:text-gold-600"
        dir="ltr"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
        </svg>
        {siteConfig.phones[0]}
      </a>
      <Link
        href="/contact/"
        className="inline-flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-slate-600 transition hover:text-gold-600"
      >
        تماس با ما ←
      </Link>
    </div>
  );
}
