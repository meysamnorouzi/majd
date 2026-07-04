"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { courseFormats } from "@/data/courses";
import { formatIcon } from "@/components/courses/FormatIcons";
import { getAccent } from "@/components/courses/accentStyles";

const COURSES_HREF = "/courses/";

export function NavCoursesDropdown({
  onNavigate,
  variant = "desktop",
}: {
  onNavigate?: () => void;
  variant?: "desktop" | "mobile";
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isCoursesActive =
    pathname === "/courses" ||
    pathname.startsWith("/courses/") ||
    pathname.startsWith("/courses");

  useEffect(() => {
    if (variant !== "desktop") return;

    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [variant]);

  if (variant === "mobile") {
    return (
      <div className="space-y-1">
        <Link
          href={COURSES_HREF}
          onClick={onNavigate}
          className={`block rounded-lg px-4 py-3 text-sm font-medium ${
            pathname === COURSES_HREF || pathname === "/courses"
              ? "bg-white/10 text-gold-400"
              : "text-white/80"
          }`}
        >
          همه دوره‌های آموزشی
        </Link>
        <div className="mr-2 space-y-1 border-r border-white/10 pr-2">
          {courseFormats.map((format) => {
            const href = `/courses/${format.slug}/`;
            const active = pathname.startsWith(href.replace(/\/$/, ""));
            return (
              <Link
                key={format.slug}
                href={href}
                onClick={onNavigate}
                className={`block rounded-lg px-4 py-2.5 text-sm ${
                  active
                    ? "bg-white/10 text-gold-400"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                {format.badge}
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative shrink-0">
      <div className="flex items-center">
        <Link
          href={COURSES_HREF}
          className={`whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium transition-colors xl:px-3 ${
            isCoursesActive
              ? "bg-white/10 text-gold-400"
              : "text-white/80 hover:bg-white/5 hover:text-white"
          }`}
        >
          دوره‌های آموزشی
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="true"
          aria-label="انواع دوره‌ها"
          className={`rounded-lg p-2 transition-colors ${
            isCoursesActive
              ? "text-gold-400 hover:bg-white/10"
              : "text-white/80 hover:bg-white/5 hover:text-white"
          }`}
        >
          <svg
            className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </button>
      </div>

      {open && (
        <div className="absolute start-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-xl border border-white/10 bg-navy-900 py-2 shadow-2xl shadow-black/40">
          <Link
            href={COURSES_HREF}
            onClick={() => setOpen(false)}
            className="block border-b border-white/10 px-4 py-3 text-sm font-semibold text-gold-400 transition hover:bg-white/5"
          >
            همه دوره‌ها
          </Link>
          <ul className="max-h-[min(24rem,70vh)] overflow-y-auto py-1">
            {courseFormats.map((format) => {
              const Icon = formatIcon(format.slug);
              const accent = getAccent(format);
              const href = `/courses/${format.slug}/`;
              return (
                <li key={format.slug}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/85 transition hover:bg-white/5 hover:text-white"
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${accent.icon}`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block font-medium">{format.badge}</span>
                      <span className="block text-xs text-white/50">
                        {format.subtitle}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
