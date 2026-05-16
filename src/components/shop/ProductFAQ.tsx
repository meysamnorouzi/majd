"use client";

import { useState } from "react";

export function ProductFAQ({
  items,
}: {
  items: { q: string; a: string }[];
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={item.q}
            className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-right transition hover:bg-white/5"
            >
              <span className="font-semibold text-white">{item.q}</span>
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold-500/40 bg-gold-500/10 text-sm text-gold-400 transition ${
                  isOpen ? "rotate-180" : ""
                }`}
                aria-hidden
              >
                ▼
              </span>
            </button>
            {isOpen && (
              <div className="border-t border-white/10 px-6 py-4 text-sm leading-relaxed text-white/70">
                {item.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
