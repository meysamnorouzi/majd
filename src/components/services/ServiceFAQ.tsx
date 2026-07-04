"use client";

import { useState } from "react";
import type { ServiceFAQ } from "@/types";

export function ServiceFAQ({ items }: { items: ServiceFAQ[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={item.q}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-4 text-right font-semibold text-navy-900 transition hover:bg-cream/50"
            >
              <span>{item.q}</span>
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-sm text-gold-600 transition ${
                  isOpen ? "rotate-180" : ""
                }`}
                aria-hidden
              >
                ▼
              </span>
            </button>
            {isOpen && (
              <div className="border-t border-slate-100 px-6 py-4 text-sm leading-relaxed text-slate-600">
                {item.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
