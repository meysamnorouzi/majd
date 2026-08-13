"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { fetchServicesClient, megaTreesToMenuItems } from "@/lib/wordpress/client";
import { ServiceIcon } from "@/components/icons/ServiceIcons";
import { siteConfig } from "@/data/site";
import type { Service } from "@/types";

const SERVICES_HREF = "/services/";

/** Static links shown in the fourth mega menu column */
const CONSULTATION_COLUMN_LINKS = [
  { href: "/contact/", label: "درخواست مشاوره رایگان" },
  { href: "/services/moshavere-hoghooghi/", label: "مشاوره حقوقی تخصصی" },
  { href: "/blogs/", label: "مقالات و راهنمای حقوقی" },
  { href: "/team/", label: "معرفی وکلای موسسه" },
  { href: "/about/", label: "درباره موسسه" },
] as const;

type MegaServiceItem = { service: Service; label: string };

function pathActive(pathname: string, href: string) {
  return pathname.startsWith(href.replace(/\/$/, ""));
}

function serviceHref(slug: string) {
  return `/services/${slug}/`;
}

function servicePathActive(pathname: string, service: Service): boolean {
  if (pathActive(pathname, serviceHref(service.slug))) return true;
  return service.children?.some((child) => servicePathActive(pathname, child)) ?? false;
}

function MegaMenuLink({
  href,
  label,
  pathname,
  onNavigate,
  nested = false,
}: {
  href: string;
  label: string;
  pathname: string;
  onNavigate: () => void;
  nested?: boolean;
}) {
  const active = pathActive(pathname, href);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      role="menuitem"
      className={`block rounded-lg transition hover:bg-white/5 hover:text-gold-400 ${
        nested ? "px-2 py-1.5 text-xs" : "px-2 py-2 text-sm"
      } ${
        active ? "bg-white/5 font-medium text-gold-400" : "text-white/75"
      }`}
    >
      {label}
    </Link>
  );
}

function MegaMenuColumn({
  service,
  label,
  pathname,
  onNavigate,
}: {
  service: Service;
  label: string;
  pathname: string;
  onNavigate: () => void;
}) {
  const columnActive = servicePathActive(pathname, service);
  const rootHref = serviceHref(service.slug);

  return (
    <div className="min-w-0 flex-1 px-4 py-4">
      <Link
        href={rootHref}
        onClick={onNavigate}
        role="menuitem"
        className={`mb-3 flex items-center gap-2.5 border-b border-white/10 pb-3 transition hover:text-gold-300 ${
          columnActive ? "text-gold-400" : "text-white"
        }`}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold-500/15 text-gold-400 [&_svg]:h-4 [&_svg]:w-4">
          <ServiceIcon name={service.icon} />
        </span>
        <span className="text-sm font-bold">{label}</span>
      </Link>

      <ul className="space-y-0.5" role="group" aria-label={label}>
        {service.children?.map((child) => {
          const hasGrandchildren = Boolean(child.children?.length);
          const childActive = servicePathActive(pathname, child);

          if (!hasGrandchildren) {
            return (
              <li key={child.slug}>
                <MegaMenuLink
                  href={serviceHref(child.slug)}
                  label={child.title}
                  pathname={pathname}
                  onNavigate={onNavigate}
                />
              </li>
            );
          }

          return (
            <li key={child.slug} className="pt-1 first:pt-0">
              <Link
                href={serviceHref(child.slug)}
                onClick={onNavigate}
                className={`block px-2 py-1.5 text-xs font-semibold transition hover:text-gold-400 ${
                  childActive ? "text-gold-400/90" : "text-white/45"
                }`}
              >
                {child.title}
              </Link>
              <ul className="mr-2 space-y-0.5 border-r border-white/10 pr-2">
                {child.children!.map((grandchild) => (
                  <li key={grandchild.slug}>
                    <MegaMenuLink
                      href={serviceHref(grandchild.slug)}
                      label={grandchild.title}
                      pathname={pathname}
                      onNavigate={onNavigate}
                      nested
                    />
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ConsultationColumn({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate: () => void;
}) {
  const columnActive = CONSULTATION_COLUMN_LINKS.some((link) =>
    pathActive(pathname, link.href),
  );

  return (
    <div className="min-w-0 flex-1 px-4 py-4">
      <div
        className={`mb-3 flex items-center gap-2.5 border-b border-white/10 pb-3 ${
          columnActive ? "text-gold-400" : "text-white"
        }`}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold-500/15 text-gold-400 [&_svg]:h-4 [&_svg]:w-4">
          <ServiceIcon name="chat" />
        </span>
        <span className="text-sm font-bold">مشاوره حقوقی</span>
      </div>

      <ul className="space-y-0.5" role="group" aria-label="مشاوره حقوقی">
        {CONSULTATION_COLUMN_LINKS.map((link) => (
          <li key={link.href}>
            <MegaMenuLink
              href={link.href}
              label={link.label}
              pathname={pathname}
              onNavigate={onNavigate}
            />
          </li>
        ))}
      </ul>

      <div className="mt-4 rounded-xl bg-white/5 p-3">
        <p className="text-xs leading-relaxed text-white/55">
          مشاوره تخصصی حضوری و تلفنی
        </p>
        <a
          href={`tel:${siteConfig.phonesTel[0]}`}
          className="mt-2 block text-sm font-bold text-gold-400 transition hover:text-gold-300"
          dir="ltr"
        >
          {siteConfig.phones[0]}
        </a>
        <Link
          href="/contact/"
          onClick={onNavigate}
          className="mt-3 block rounded-lg bg-gold-500 px-3 py-2 text-center text-xs font-semibold text-navy-950 transition hover:bg-gold-400"
        >
          درخواست مشاوره
        </Link>
      </div>
    </div>
  );
}

function DesktopMegaMenu({
  onNavigate,
  megaServices,
}: {
  onNavigate: () => void;
  megaServices: MegaServiceItem[];
}) {
  const pathname = usePathname();

  return (
    <div className="grid min-h-[14rem] grid-cols-4 divide-x divide-x-reverse divide-white/10">
      {megaServices.map(({ service, label }) => (
        <MegaMenuColumn
          key={service.slug}
          service={service}
          label={label}
          pathname={pathname}
          onNavigate={onNavigate}
        />
      ))}
      <ConsultationColumn pathname={pathname} onNavigate={onNavigate} />
    </div>
  );
}

function MobileServiceNode({
  service,
  label,
  onNavigate,
  depth = 0,
}: {
  service: Service;
  label?: string;
  onNavigate?: () => void;
  depth?: number;
}) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const href = serviceHref(service.slug);
  const active = servicePathActive(pathname, service);
  const hasChildren = Boolean(service.children?.length);
  const displayLabel = label ?? service.title;

  return (
    <div>
      <div className="flex items-center gap-1">
        <Link
          href={href}
          onClick={onNavigate}
          className={`flex min-w-0 flex-1 items-center gap-2.5 rounded-lg px-4 py-2.5 text-sm ${
            depth > 0 ? "px-3 py-2" : ""
          } ${
            active
              ? "bg-white/10 text-gold-400"
              : "text-white/70 hover:bg-white/5 hover:text-white"
          }`}
          style={depth > 0 ? { paddingInlineStart: `${depth * 0.75 + 0.75}rem` } : undefined}
        >
          {depth === 0 && (
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gold-500/15 text-gold-400 [&_svg]:h-4 [&_svg]:w-4">
              <ServiceIcon name={service.icon} />
            </span>
          )}
          <span className="truncate">{displayLabel}</span>
        </Link>
        {hasChildren && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-label={`زیرمجموعه‌های ${displayLabel}`}
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
          {service.children!.map((child) => (
            <MobileServiceNode
              key={child.slug}
              service={child}
              onNavigate={onNavigate}
              depth={depth + 1}
            />
          ))}
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
  const menuId = useId();
  const [open, setOpen] = useState(false);
  const [megaServices, setMegaServices] = useState<MegaServiceItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchServicesClient().then(({ megaMenu, megaTrees }) => {
      if (!cancelled) {
        setMegaServices(megaTreesToMenuItems(megaMenu, megaTrees));
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

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
          {megaServices.map(({ service, label }) => (
            <MobileServiceNode
              key={service.slug}
              service={service}
              label={label}
              onNavigate={onNavigate}
            />
          ))}
          <div className="mt-2 border-t border-white/10 pt-2">
            <p className="px-4 py-2 text-xs font-semibold text-gold-400/80">
              مشاوره حقوقی
            </p>
            {CONSULTATION_COLUMN_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onNavigate}
                className="block rounded-lg px-4 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
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
        <Link
          href={SERVICES_HREF}
          className="whitespace-nowrap py-2 ps-2.5 pe-0.5 text-sm font-medium xl:ps-3"
          aria-expanded={open}
          aria-haspopup="true"
          aria-controls={menuId}
        >
          خدمات
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
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
        className={`absolute left-1/2 top-full z-50 mt-1 w-[58rem] max-w-[calc(100vw-1.5rem)] origin-top rounded-xl border border-white/10 bg-navy-900 py-1 shadow-2xl shadow-black/40 transition-all duration-200 ${
          open
            ? "pointer-events-auto -translate-x-1/2 translate-y-0 opacity-100 visible"
            : "pointer-events-none -translate-x-1/2 -translate-y-1 opacity-0 invisible"
        }`}
      >
        <DesktopMegaMenu
          onNavigate={handleNavigate}
          megaServices={megaServices}
        />
      </div>
    </div>
  );
}
