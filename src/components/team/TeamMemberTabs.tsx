"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { TeamMember } from "@/types";

const TAB_ITEMS = [
  { id: "bio", label: "بیوگرافی", icon: "user" },
  { id: "expertise", label: "حوزه‌های تخصصی", icon: "scale" },
  { id: "achievements", label: "دستاوردها", icon: "trophy" },
] as const;

type TabId = (typeof TAB_ITEMS)[number]["id"];

const EASE = [0.22, 1, 0.36, 1] as const;

function TabIcon({ type }: { type: string }) {
  if (type === "user") {
    return (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    );
  }
  if (type === "scale") {
    return (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.589-1.202L18.75 4.97Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.589-1.202L5.25 4.97Z" />
      </svg>
    );
  }
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.003 6.003 0 0 1-3.395 1.002M16.27 9.728a6.003 6.003 0 0 0 3.395-1.002" />
    </svg>
  );
}

function ExpertiseCard({ area }: { area: string }) {
  return (
    <div className="group flex items-start gap-4 rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-gold-400/40 hover:shadow-md">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-navy-900/5 text-gold-600 transition group-hover:bg-gold-500/10">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
        </svg>
      </div>
      <p className="text-sm font-semibold leading-relaxed text-navy-900">{area}</p>
    </div>
  );
}

export function TeamMemberTabs({ member }: { member: TeamMember }) {
  const [activeTab, setActiveTab] = useState<TabId>("bio");
  const reduced = useReducedMotion();

  return (
    <div>
      <div
        role="tablist"
        className="flex gap-2 overflow-x-auto rounded-xl bg-cream/80 p-2"
      >
        {TAB_ITEMS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex shrink-0 items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition ${
              activeTab === tab.id
                ? "bg-navy-900 text-gold-400 shadow-md"
                : "text-slate-600 hover:bg-white hover:text-navy-900"
            }`}
          >
            <TabIcon type={tab.icon} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-8" role="tabpanel">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: reduced ? 0.01 : 0.35, ease: EASE }}
          >
            {activeTab === "bio" && (
              <div className="space-y-5">
                {member.fullBio.map((paragraph, i) => (
                  <p
                    key={i}
                    className="leading-relaxed text-slate-600 first:text-lg first:font-medium first:text-slate-700"
                  >
                    {paragraph}
                  </p>
                ))}
                <div className="flex items-center gap-4 rounded-xl bg-cream/80 p-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy-900 text-gold-400">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy-900">تحصیلات</p>
                    <p className="mt-0.5 text-sm text-slate-600">{member.education}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "expertise" && (
              <div className="grid gap-4 sm:grid-cols-2">
                {member.areasOfPractice.map((area) => (
                  <ExpertiseCard key={area} area={area} />
                ))}
              </div>
            )}

            {activeTab === "achievements" && (
              <ul className="space-y-3">
                {member.achievements.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 rounded-xl border border-slate-100 bg-white px-5 py-4 text-sm text-slate-700 shadow-sm"
                  >
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-xs font-bold text-gold-600">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
