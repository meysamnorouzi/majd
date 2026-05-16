"use client";

import { useState } from "react";
import { coursesFAQ } from "@/data/courses";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";

export function CoursesFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-cream py-20">
      <Container>
        <SectionTitle
          eyebrow="سوالات متداول"
          title="پرسش‌های رایج درباره دوره‌ها"
        />
        <div className="mx-auto max-w-3xl space-y-3">
          {coursesFAQ.map((item, i) => (
            <div
              key={item.q}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
            >
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-4 text-right font-semibold text-navy-900 transition hover:bg-cream/50"
              >
                <span>{item.q}</span>
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-gold-600 transition ${
                    open === i ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>
              {open === i && (
                <div className="border-t border-slate-100 px-6 py-4 text-sm leading-relaxed text-slate-600">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
