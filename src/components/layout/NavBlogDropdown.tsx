"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import {
  fetchCategoriesClient,
  type BlogCategory,
} from "@/lib/wordpress/client";

const BLOG_HREF = "/blog/";

/** Query-param URLs avoid static-export missing-param errors in next dev */
function categoryHref(slug: string) {
  return `/blog/?category=${encodeURIComponent(slug)}`;
}

function categoryLabel(name: string) {
  return name.startsWith("مقالات") ? name : `مقالات ${name}`;
}

function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`h-3.5 w-3.5 shrink-0 ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 19.5 8.25 12l7.5-7.5"
      />
    </svg>
  );
}

function DesktopCategoryItem({
  category,
  onNavigate,
  activeSlug,
}: {
  category: BlogCategory;
  onNavigate: () => void;
  activeSlug: string | null;
}) {
  const [subOpen, setSubOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const href = categoryHref(category.slug);
  const hasChildren = category.children.length > 0;
  const active =
    activeSlug === category.slug ||
    category.children.some((c) => activeSlug === c.slug);

  function clearTimer() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function openSub() {
    clearTimer();
    setSubOpen(true);
  }

  function scheduleCloseSub() {
    clearTimer();
    closeTimer.current = setTimeout(() => setSubOpen(false), 140);
  }

  useEffect(() => () => clearTimer(), []);

  return (
    <li
      role="none"
      className="relative"
      onMouseEnter={hasChildren ? openSub : undefined}
      onMouseLeave={hasChildren ? scheduleCloseSub : undefined}
    >
      <Link
        href={href}
        onClick={onNavigate}
        role="menuitem"
        aria-haspopup={hasChildren || undefined}
        aria-expanded={hasChildren ? subOpen : undefined}
        className={`flex items-center justify-between gap-3 px-4 py-2.5 text-sm transition hover:bg-white/5 hover:text-white ${
          active ? "bg-white/5 text-gold-400" : "text-white/85"
        }`}
      >
        <span className="min-w-0">
          <span className="block font-medium">
            {categoryLabel(category.name)}
          </span>
          {category.count > 0 && (
            <span className="mt-0.5 block text-xs text-white/40">
              {category.count.toLocaleString("fa-IR")} مقاله
            </span>
          )}
        </span>
        {hasChildren && <Chevron className="text-white/40" />}
      </Link>

      {hasChildren && (
        <div
          className={`absolute top-0 start-full z-[60] ms-1 w-56 origin-top-left rounded-xl border border-white/10 bg-navy-900 py-2 shadow-2xl shadow-black/50 transition-all duration-150 ${
            subOpen
              ? "pointer-events-auto translate-x-0 opacity-100 visible"
              : "pointer-events-none -translate-x-1 opacity-0 invisible"
          }`}
          role="menu"
          aria-label={categoryLabel(category.name)}
          onMouseEnter={openSub}
          onMouseLeave={scheduleCloseSub}
        >
          <Link
            href={href}
            onClick={onNavigate}
            role="menuitem"
            className="block border-b border-white/10 px-4 py-2.5 text-xs font-semibold text-gold-400 transition hover:bg-white/5"
          >
            همه — {categoryLabel(category.name)}
          </Link>
          <ul className="py-1">
            {category.children.map((child) => {
              const childHref = categoryHref(child.slug);
              const childActive = activeSlug === child.slug;
              return (
                <li key={child.slug} role="none">
                  <Link
                    href={childHref}
                    onClick={onNavigate}
                    role="menuitem"
                    className={`block px-4 py-2.5 text-sm transition hover:bg-white/5 hover:text-white ${
                      childActive
                        ? "bg-white/5 text-gold-400"
                        : "text-white/80"
                    }`}
                  >
                    <span className="block font-medium">
                      {categoryLabel(child.name)}
                    </span>
                    {child.count > 0 && (
                      <span className="mt-0.5 block text-xs text-white/40">
                        {child.count.toLocaleString("fa-IR")} مقاله
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </li>
  );
}

function MobileCategoryItem({
  category,
  onNavigate,
  activeSlug,
}: {
  category: BlogCategory;
  onNavigate?: () => void;
  activeSlug: string | null;
}) {
  const [expanded, setExpanded] = useState(false);
  const href = categoryHref(category.slug);
  const active = activeSlug === category.slug;
  const hasChildren = category.children.length > 0;

  return (
    <div>
      <div className="flex items-center gap-1">
        <Link
          href={href}
          onClick={onNavigate}
          className={`flex min-w-0 flex-1 items-center rounded-lg px-4 py-2.5 text-sm ${
            active
              ? "bg-white/10 text-gold-400"
              : "text-white/70 hover:bg-white/5 hover:text-white"
          }`}
        >
          <span className="truncate">{categoryLabel(category.name)}</span>
        </Link>
        {hasChildren && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-label={`زیرمجموعه‌های ${categoryLabel(category.name)}`}
            className="rounded-lg p-2 text-white/60 hover:bg-white/5 hover:text-white"
          >
            <svg
              className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
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
        )}
      </div>
      {hasChildren && expanded && (
        <div className="mr-4 mt-1 space-y-0.5 border-r border-white/10 pr-2">
          {category.children.map((child) => {
            const childHref = categoryHref(child.slug);
            const childActive = activeSlug === child.slug;
            return (
              <Link
                key={child.slug}
                href={childHref}
                onClick={onNavigate}
                className={`block rounded-lg px-3 py-2 text-sm ${
                  childActive
                    ? "bg-white/10 text-gold-400"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                {categoryLabel(child.name)}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function NavBlogDropdownInner({
  onNavigate,
  variant = "desktop",
}: {
  onNavigate?: () => void;
  variant?: "desktop" | "mobile";
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeSlug = searchParams.get("category");
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isBlogActive =
    pathname === "/blog" ||
    pathname === "/blog/" ||
    pathname.startsWith("/blog/");

  useEffect(() => {
    let cancelled = false;
    fetchCategoriesClient().then((data) => {
      if (!cancelled) setCategories(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  function clearCloseTimer() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function openMenu() {
    clearCloseTimer();
    setOpen(true);
  }

  function scheduleClose() {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }

  function handleNavigate() {
    setOpen(false);
    onNavigate?.();
  }

  useEffect(() => () => clearCloseTimer(), []);

  useEffect(() => {
    if (variant !== "desktop" || !open) return;

    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [variant, open]);

  if (variant === "mobile") {
    return (
      <div className="space-y-1">
        <Link
          href={BLOG_HREF}
          onClick={onNavigate}
          className={`block rounded-lg px-4 py-3 text-sm font-medium ${
            pathname === BLOG_HREF || pathname === "/blog"
              ? "bg-white/10 text-gold-400"
              : "text-white/80"
          }`}
        >
          همه مقالات
        </Link>
        {categories.length > 0 && (
          <div className="mr-2 space-y-1 border-r border-white/10 pr-2">
            {categories.map((category) => (
              <MobileCategoryItem
                key={category.slug}
                category={category}
                onNavigate={onNavigate}
                activeSlug={activeSlug}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative shrink-0"
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      <div
        className={`flex items-center gap-0 rounded-lg transition-colors ${
          isBlogActive || open
            ? "bg-white/10 text-gold-400"
            : "text-white/80 hover:bg-white/5 hover:text-white"
        }`}
      >
        <Link
          href={BLOG_HREF}
          className="whitespace-nowrap py-2 ps-2.5 pe-0.5 text-sm font-medium xl:ps-3"
          aria-expanded={open}
          aria-haspopup="true"
        >
          مقالات
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="true"
          aria-label="فهرست دسته‌بندی مقالات"
          className="py-2 pe-1.5 ps-0"
        >
          <svg
            className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
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

      <div
        className={`absolute start-0 top-full z-50 mt-1 w-72 origin-top rounded-xl border border-white/10 bg-navy-900 py-2 shadow-2xl shadow-black/40 transition-all duration-200 ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100 visible"
            : "pointer-events-none -translate-y-1 opacity-0 invisible"
        }`}
        role="menu"
        aria-label="مقالات"
      >
        <Link
          href={BLOG_HREF}
          onClick={handleNavigate}
          role="menuitem"
          className="block border-b border-white/10 px-4 py-3 text-sm font-semibold text-gold-400 transition hover:bg-white/5"
        >
          همه مقالات
        </Link>
        {categories.length === 0 ? (
          <p className="px-4 py-3 text-xs text-white/45">
            دسته‌بندی‌ها در حال بارگذاری…
          </p>
        ) : (
          <ul className="py-1">
            {categories.map((category) => (
              <DesktopCategoryItem
                key={category.slug}
                category={category}
                onNavigate={handleNavigate}
                activeSlug={activeSlug}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export function NavBlogDropdown({
  onNavigate,
  variant = "desktop",
}: {
  onNavigate?: () => void;
  variant?: "desktop" | "mobile";
}) {
  return (
    <Suspense
      fallback={
        <Link
          href={BLOG_HREF}
          className="whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium text-white/80 xl:px-3"
        >
          مقالات
        </Link>
      }
    >
      <NavBlogDropdownInner onNavigate={onNavigate} variant={variant} />
    </Suspense>
  );
}
