"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { fetchServicesClient, megaTreesToMenuItems } from "@/lib/wordpress/client";
import { ServiceIcon } from "@/components/icons/ServiceIcons";
import {
  hubPath,
  isServiceCategoryNode,
  isServiceCategoryPrefix,
  isServiceNavPath,
  servicePath,
} from "@/lib/service-paths";
import type { Service } from "@/types";

type MegaServiceItem = { service: Service; label: string };

function pathActive(pathname: string, href: string) {
  return pathname.startsWith(href.replace(/\/$/, ""));
}

function serviceHref(service: Service) {
  return servicePath(service);
}

function pillarHref(service: Service) {
  return isServiceCategoryPrefix(service.categoryPrefix)
    ? hubPath(service.categoryPrefix)
    : undefined;
}

function servicePathActive(pathname: string, service: Service): boolean {
  if (
    !isServiceCategoryNode(service) &&
    pathActive(pathname, serviceHref(service))
  ) {
    return true;
  }
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
  const href = pillarHref(service);

  return (
    <div className="min-w-0 flex-1 border-e border-white/10 px-3 py-4 last:border-e-0">
      {href ? (
        <Link
          href={href}
          onClick={onNavigate}
          className={`mb-3 flex items-center gap-2 border-b border-white/10 pb-3 transition hover:text-gold-400 ${
            columnActive ? "text-gold-400" : "text-white"
          }`}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold-500/15 text-gold-400 [&_svg]:h-4 [&_svg]:w-4">
            <ServiceIcon name={service.icon} />
          </span>
          <span className="text-sm font-bold">{label}</span>
        </Link>
      ) : (
        <div
          className={`mb-3 flex items-center gap-2 border-b border-white/10 pb-3 ${
            columnActive ? "text-gold-400" : "text-white"
          }`}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold-500/15 text-gold-400 [&_svg]:h-4 [&_svg]:w-4">
            <ServiceIcon name={service.icon} />
          </span>
          <span className="text-sm font-bold">{label}</span>
        </div>
      )}

      <ul className="space-y-0.5" role="group" aria-label={label}>
        {(!service.children || service.children.length === 0) && href ? (
          <li>
            <MegaMenuLink
              href={href}
              label={`صفحه ${label}`}
              pathname={pathname}
              onNavigate={onNavigate}
            />
          </li>
        ) : null}
        {service.children?.map((child) => {
          const hasGrandchildren = Boolean(child.children?.length);
          const childActive = servicePathActive(pathname, child);
          const childIsCategory = isServiceCategoryNode(child);

          if (!hasGrandchildren) {
            return (
              <li key={child.slug}>
                <MegaMenuLink
                  href={serviceHref(child)}
                  label={child.title}
                  pathname={pathname}
                  onNavigate={onNavigate}
                />
              </li>
            );
          }

          return (
            <li key={child.slug} className="pt-1 first:pt-0">
              {childIsCategory ? (
                <p
                  className={`block px-2 py-1.5 text-xs font-semibold ${
                    childActive ? "text-gold-400/90" : "text-white/45"
                  }`}
                >
                  {child.title}
                </p>
              ) : (
                <Link
                  href={serviceHref(child)}
                  onClick={onNavigate}
                  className={`block px-2 py-1.5 text-xs font-semibold transition hover:text-gold-400 ${
                    childActive ? "text-gold-400/90" : "text-white/45"
                  }`}
                >
                  {child.title}
                </Link>
              )}
              <ul className="mr-2 space-y-0.5 border-r border-white/10 pr-2">
                {child.children!.map((grandchild) => (
                  <li key={grandchild.slug}>
                    <MegaMenuLink
                      href={serviceHref(grandchild)}
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

function DesktopMegaMenu({
  onNavigate,
  megaServices,
}: {
  onNavigate: () => void;
  megaServices: MegaServiceItem[];
}) {
  const pathname = usePathname();

  return (
    <div className="grid min-h-[14rem] grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
      {megaServices.map(({ service, label }) => (
        <MegaMenuColumn
          key={service.slug}
          service={service}
          label={label}
          pathname={pathname}
          onNavigate={onNavigate}
        />
      ))}
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
  const hasChildren = Boolean(service.children?.length);
  const hub = pillarHref(service);
  const isCategory = isServiceCategoryNode(service) || hasChildren;
  const href = isCategory ? hub : serviceHref(service);
  const active = servicePathActive(pathname, service);
  const displayLabel = label ?? service.title;

  const labelClass = `flex min-w-0 flex-1 items-center gap-2.5 rounded-lg px-4 py-2.5 text-sm ${
    depth > 0 ? "px-3 py-2" : ""
  } ${
    active
      ? "bg-white/10 text-gold-400"
      : "text-white/70 hover:bg-white/5 hover:text-white"
  }`;

  return (
    <div>
      <div className="flex items-center gap-1">
        {href ? (
          <Link
            href={href}
            onClick={onNavigate}
            className={labelClass}
            style={depth > 0 ? { paddingInlineStart: `${depth * 0.75 + 0.75}rem` } : undefined}
          >
            {depth === 0 && (
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gold-500/15 text-gold-400 [&_svg]:h-4 [&_svg]:w-4">
                <ServiceIcon name={service.icon} />
              </span>
            )}
            <span className="truncate">{displayLabel}</span>
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => hasChildren && setExpanded((v) => !v)}
            aria-expanded={hasChildren ? expanded : undefined}
            className={labelClass}
            style={depth > 0 ? { paddingInlineStart: `${depth * 0.75 + 0.75}rem` } : undefined}
          >
            {depth === 0 && (
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gold-500/15 text-gold-400 [&_svg]:h-4 [&_svg]:w-4">
                <ServiceIcon name={service.icon} />
              </span>
            )}
            <span className="truncate">{displayLabel}</span>
          </button>
        )}
        {hasChildren && href && (
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
        {hasChildren && !href && (
          <span className="pointer-events-none pe-2 text-white/60" aria-hidden>
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
          </span>
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
  const loadStarted = useRef(false);

  function loadMegaServices() {
    if (loadStarted.current) return;
    loadStarted.current = true;
    fetchServicesClient().then(({ megaMenu, megaTrees }) => {
      setMegaServices(megaTreesToMenuItems(megaMenu, megaTrees));
    });
  }

  useEffect(() => {
    loadMegaServices();
  }, []);

  const isServicesActive = isServiceNavPath(pathname);

  function clearCloseTimer() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function openMenu() {
    loadMegaServices();
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
        <div className="mr-2 space-y-1 border-r border-white/10 pr-2">
          {megaServices.map(({ service, label }) => (
            <MobileServiceNode
              key={service.slug}
              service={service}
              label={label}
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
            loadMegaServices();
            setOpen((v) => !v);
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
        className={`absolute left-1/2 top-full z-50 mt-1 w-[72rem] max-w-[calc(100vw-1.5rem)] origin-top rounded-xl border border-white/10 bg-navy-900 py-1 shadow-2xl shadow-black/40 transition-all duration-200 ${
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
