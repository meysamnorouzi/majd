"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { services } from "@/data/site";
import { ServiceIcon } from "@/components/icons/ServiceIcons";
import type { Service } from "@/types";

const SERVICES_HREF = "/services/";

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

function DesktopServiceItem({
  service,
  onNavigate,
}: {
  service: Service;
  onNavigate: () => void;
}) {
  const pathname = usePathname();
  const [subOpen, setSubOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const href = `/services/${service.slug}/`;
  const active =
    pathname.startsWith(href.replace(/\/$/, "")) ||
    (service.children?.some((c) =>
      pathname.startsWith(`/services/${c.slug}`),
    ) ??
      false);
  const hasChildren = Boolean(service.children?.length);

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
        className={`flex items-start gap-3 px-4 py-2.5 text-sm transition hover:bg-white/5 hover:text-white ${
          active ? "bg-white/5 text-gold-400" : "text-white/85"
        }`}
      >
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold-500/15 text-gold-400 [&_svg]:h-4 [&_svg]:w-4">
          <ServiceIcon name={service.icon} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center justify-between gap-2">
            <span className="font-medium">{service.title}</span>
            {hasChildren && <Chevron className="text-white/40" />}
          </span>
          <span className="mt-0.5 block line-clamp-1 text-xs text-white/45">
            {service.excerpt}
          </span>
        </span>
      </Link>

      {hasChildren && (
        <div
          className={`absolute top-0 end-full z-[60] ms-1 w-64 origin-top-right rounded-xl border border-white/10 bg-navy-900 py-2 shadow-2xl shadow-black/50 transition-all duration-150 ${
            subOpen
              ? "pointer-events-auto translate-x-0 opacity-100 visible"
              : "pointer-events-none translate-x-1 opacity-0 invisible"
          }`}
          role="menu"
          aria-label={service.title}
          onMouseEnter={openSub}
          onMouseLeave={scheduleCloseSub}
        >
          <Link
            href={href}
            onClick={onNavigate}
            role="menuitem"
            className="block border-b border-white/10 px-4 py-2.5 text-xs font-semibold text-gold-400 transition hover:bg-white/5"
          >
            مشاهده همه — {service.title}
          </Link>
          <ul className="py-1">
            {service.children!.map((child) => {
              const childHref = `/services/${child.slug}/`;
              const childActive = pathname.startsWith(
                childHref.replace(/\/$/, ""),
              );
              return (
                <li key={child.slug} role="none">
                  <Link
                    href={childHref}
                    onClick={onNavigate}
                    role="menuitem"
                    className={`block px-4 py-2.5 text-sm transition hover:bg-white/5 hover:text-white ${
                      childActive ? "bg-white/5 text-gold-400" : "text-white/80"
                    }`}
                  >
                    <span className="block font-medium">{child.title}</span>
                    <span className="mt-0.5 block line-clamp-1 text-xs text-white/40">
                      {child.excerpt}
                    </span>
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

function MobileServiceItem({
  service,
  onNavigate,
}: {
  service: Service;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const href = `/services/${service.slug}/`;
  const active = pathname.startsWith(href.replace(/\/$/, ""));
  const hasChildren = Boolean(service.children?.length);

  return (
    <div>
      <div className="flex items-center gap-1">
        <Link
          href={href}
          onClick={onNavigate}
          className={`flex min-w-0 flex-1 items-center gap-2.5 rounded-lg px-4 py-2.5 text-sm ${
            active
              ? "bg-white/10 text-gold-400"
              : "text-white/70 hover:bg-white/5 hover:text-white"
          }`}
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gold-500/15 text-gold-400 [&_svg]:h-4 [&_svg]:w-4">
            <ServiceIcon name={service.icon} />
          </span>
          <span className="truncate">{service.title}</span>
        </Link>
        {hasChildren && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-label={`زیرمجموعه‌های ${service.title}`}
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
          {service.children!.map((child) => {
            const childHref = `/services/${child.slug}/`;
            const childActive = pathname.startsWith(
              childHref.replace(/\/$/, ""),
            );
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
                {child.title}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function NavServicesDropdown({
  onNavigate,
  variant = "desktop",
}: {
  onNavigate?: () => void;
  variant?: "desktop" | "mobile";
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isServicesActive =
    pathname === "/services" || pathname.startsWith("/services/");

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

  useEffect(() => {
    return () => clearCloseTimer();
  }, []);

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
          href={SERVICES_HREF}
          onClick={onNavigate}
          className={`block rounded-lg px-4 py-3 text-sm font-medium ${
            pathname === SERVICES_HREF || pathname === "/services"
              ? "bg-white/10 text-gold-400"
              : "text-white/80"
          }`}
        >
          همه خدمات
        </Link>
        <div className="mr-2 space-y-1 border-r border-white/10 pr-2">
          {services.map((service) => (
            <MobileServiceItem
              key={service.slug}
              service={service}
              onNavigate={onNavigate}
            />
          ))}
        </div>
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
      <div className="flex items-center">
        <Link
          href={SERVICES_HREF}
          className={`whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium transition-colors xl:px-3 ${
            isServicesActive
              ? "bg-white/10 text-gold-400"
              : "text-white/80 hover:bg-white/5 hover:text-white"
          }`}
          aria-expanded={open}
          aria-haspopup="true"
        >
          خدمات
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="true"
          aria-label="فهرست خدمات"
          className={`rounded-lg p-2 transition-colors ${
            isServicesActive
              ? "text-gold-400 hover:bg-white/10"
              : "text-white/80 hover:bg-white/5 hover:text-white"
          }`}
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
        className={`absolute start-0 top-full z-50 mt-1 w-80 origin-top rounded-xl border border-white/10 bg-navy-900 py-2 shadow-2xl shadow-black/40 transition-all duration-200 ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100 visible"
            : "pointer-events-none -translate-y-1 opacity-0 invisible"
        }`}
        role="menu"
        aria-label="خدمات"
      >
        <Link
          href={SERVICES_HREF}
          onClick={handleNavigate}
          role="menuitem"
          className="block border-b border-white/10 px-4 py-3 text-sm font-semibold text-gold-400 transition hover:bg-white/5"
        >
          همه خدمات
        </Link>
        <ul className="py-1">
          {services.map((service) => (
            <DesktopServiceItem
              key={service.slug}
              service={service}
              onNavigate={handleNavigate}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
