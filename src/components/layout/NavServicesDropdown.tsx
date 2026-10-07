"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ServiceIcon } from "@/components/icons/ServiceIcons";
import { fetchServiceMenuClient } from "@/lib/wordpress/service-landings";
import type { ServiceHub } from "@/lib/wordpress/service-landings";
import { hubPath, isServiceNavPath, servicePathFromParts } from "@/lib/service-paths";

function pathActive(pathname: string, href: string) {
  const target = href.replace(/\/$/, "");
  return pathname === target || pathname.startsWith(`${target}/`);
}

function HubColumn({
  hub,
  pathname,
  onNavigate,
}: {
  hub: ServiceHub;
  pathname: string;
  onNavigate: () => void;
}) {
  const href = hubPath(hub.slug);
  const active = pathActive(pathname, href);

  return (
    <div className="min-w-0 border-e border-white/10 px-3 py-4 last:border-e-0">
      <Link
        href={href}
        onClick={onNavigate}
        className={`mb-3 flex items-center gap-2 border-b border-white/10 pb-3 transition hover:text-gold-400 ${
          active ? "text-gold-400" : "text-white"
        }`}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold-500/15 text-gold-400 [&_svg]:h-4 [&_svg]:w-4">
          <ServiceIcon name={hub.icon} />
        </span>
        <span className="text-sm font-bold">{hub.menuLabel}</span>
      </Link>
      <ul className="space-y-0.5" role="group" aria-label={hub.menuLabel}>
        {hub.landings.length === 0 ? null : (
          hub.landings.map((landing) => {
            const landingHref = servicePathFromParts(hub.slug, landing.slug);
            const landingActive = pathActive(pathname, landingHref);
            return (
              <li key={landing.slug}>
                <Link
                  href={landingHref}
                  onClick={onNavigate}
                  role="menuitem"
                  className={`block rounded-lg px-2 py-2 text-sm transition hover:bg-white/5 hover:text-gold-400 ${
                    landingActive
                      ? "bg-white/5 font-medium text-gold-400"
                      : "text-white/75"
                  }`}
                >
                  {landing.title}
                </Link>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}

function MobileHub({
  hub,
  onNavigate,
}: {
  hub: ServiceHub;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const href = hubPath(hub.slug);
  const active = pathActive(pathname, href);
  const hasChildren = hub.landings.length > 0;

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
            <ServiceIcon name={hub.icon} />
          </span>
          <span className="truncate">{hub.menuLabel}</span>
        </Link>
        {hasChildren ? (
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            aria-label={`زیرلندینگ‌های ${hub.menuLabel}`}
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
        ) : null}
      </div>
      {hasChildren && expanded ? (
        <div className="mr-4 mt-1 space-y-0.5 border-r border-white/10 pr-2">
          {hub.landings.map((landing) => {
            const landingHref = servicePathFromParts(hub.slug, landing.slug);
            const landingActive = pathActive(pathname, landingHref);
            return (
              <Link
                key={landing.slug}
                href={landingHref}
                onClick={onNavigate}
                className={`block rounded-lg px-3 py-2 text-sm ${
                  landingActive
                    ? "bg-white/10 text-gold-400"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                {landing.title}
              </Link>
            );
          })}
        </div>
      ) : null}
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
  const menuId = useId();
  const [open, setOpen] = useState(false);
  const [hubs, setHubs] = useState<ServiceHub[] | null>(null);
  const [menuError, setMenuError] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadStarted = useRef(false);

  function loadHubs() {
    if (loadStarted.current) return;
    loadStarted.current = true;
    fetchServiceMenuClient()
      .then(setHubs)
      .catch(() => {
        setHubs([]);
        setMenuError("بارگذاری خدمات انجام نشد.");
      });
  }

  useEffect(() => {
    loadHubs();
  }, []);

  const isServicesActive =
    isServiceNavPath(pathname) ||
    (hubs ?? []).some((hub) => pathActive(pathname, hubPath(hub.slug)));

  function clearCloseTimer() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function openMenu() {
    loadHubs();
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

    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [variant, open]);

  const columns = Math.min(Math.max(hubs?.length ?? 1, 1), 5);

  if (variant === "mobile") {
    return (
      <div className="space-y-1">
        <div className="mr-2 space-y-1 border-r border-white/10 pr-2">
          {menuError ? (
            <p className="px-3 py-2 text-sm text-white/70">{menuError}</p>
          ) : null}
          {hubs === null && !menuError ? (
            <p className="px-3 py-2 text-sm text-white/50">در حال بارگذاری…</p>
          ) : null}
          {hubs?.length === 0 && !menuError ? (
            <p className="px-3 py-2 text-sm text-white/70">
              لندینگی ثبت نشده است.
            </p>
          ) : null}
          {hubs?.map((hub) => (
            <MobileHub key={hub.slug} hub={hub} onNavigate={onNavigate} />
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
      <div
        className={`flex items-center gap-0 rounded-lg transition-colors ${
          isServicesActive || open
            ? "bg-white/10 text-gold-400"
            : "text-white/80 hover:bg-white/5 hover:text-white"
        }`}
      >
        <button
          type="button"
          onClick={() => {
            loadHubs();
            setOpen((value) => !value);
          }}
          className="whitespace-nowrap py-2 ps-2.5 pe-0.5 text-sm font-medium xl:ps-3"
          aria-expanded={open}
          aria-haspopup="true"
          aria-controls={menuId}
        >
          خدمات
        </button>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-haspopup="true"
          aria-controls={menuId}
          aria-label="فهرست خدمات"
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
        id={menuId}
        role="menu"
        aria-label="خدمات حقوقی"
        className={`absolute left-1/2 top-full z-50 mt-1 max-h-[70vh] max-w-[calc(100vw-1.5rem)] origin-top overflow-y-auto rounded-xl border border-white/10 bg-navy-900 py-1 shadow-2xl shadow-black/40 transition-all duration-200 ${
          open
            ? "pointer-events-auto -translate-x-1/2 translate-y-0 opacity-100 visible"
            : "pointer-events-none -translate-x-1/2 -translate-y-1 opacity-0 invisible"
        } ${columns >= 4 ? "w-[72rem]" : "w-max min-w-[20rem]"}`}
      >
        {menuError ? (
          <p className="px-6 py-8 text-sm text-white/70">{menuError}</p>
        ) : null}
        {hubs === null && !menuError ? (
          <p className="px-6 py-8 text-sm text-white/50">در حال بارگذاری…</p>
        ) : null}
        {hubs?.length === 0 && !menuError ? (
          <p className="px-6 py-8 text-sm text-white/70">لندینگی ثبت نشده است.</p>
        ) : null}
        {hubs && hubs.length > 0 ? (
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(11rem, 1fr))`,
            }}
          >
            {hubs.map((hub) => (
              <HubColumn
                key={hub.slug}
                hub={hub}
                pathname={pathname}
                onNavigate={handleNavigate}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
