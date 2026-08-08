"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { fetchServicesClient, megaTreesToMenuItems } from "@/lib/wordpress/client";
import { ServiceIcon } from "@/components/icons/ServiceIcons";
import type { Service } from "@/types";

const SERVICES_HREF = "/services/";

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

function getThirdLayerItems(service: Service) {
  return service.children ?? [];
}

function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`h-3.5 w-3.5 shrink-0 ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 19.5 8.25 12l7.5-7.5"
      />
    </svg>
  );
}

function MegaMenuSubItem({
  child,
  pathname,
  onNavigate,
  isHovered,
  onHover,
}: {
  child: Service;
  pathname: string;
  onNavigate: () => void;
  isHovered: boolean;
  onHover: () => void;
}) {
  const href = serviceHref(child.slug);
  const thirdLayerItems = getThirdLayerItems(child);
  const hasThirdLayer = thirdLayerItems.length > 0;
  const active = servicePathActive(pathname, child);

  const itemClass = `flex w-full items-center justify-between gap-2 border-b border-white/[0.06] px-4 py-2.5 text-start text-sm transition last:border-b-0 hover:bg-white/5 hover:text-gold-400 ${
    isHovered
      ? "bg-white/5 text-gold-400"
      : active
        ? "text-gold-400/80"
        : "text-white/75"
  }`;

  return (
    <li role="none" onMouseEnter={onHover}>
      {hasThirdLayer ? (
        <div
          role="menuitem"
          aria-haspopup="true"
          aria-expanded={isHovered}
          className={itemClass}
        >
          <span className="whitespace-nowrap">{child.title}</span>
          <Chevron className={isHovered ? "text-gold-400/70" : "text-white/40"} />
        </div>
      ) : (
        <Link
          href={href}
          onClick={onNavigate}
          role="menuitem"
          className={itemClass}
        >
          <span className="whitespace-nowrap">{child.title}</span>
        </Link>
      )}
    </li>
  );
}

function DesktopMegaMenu({
  open,
  onNavigate,
  megaServices,
}: {
  open: boolean;
  onNavigate: () => void;
  megaServices: MegaServiceItem[];
}) {
  const pathname = usePathname();
  const [activeSlug, setActiveSlug] = useState(
    () => megaServices[0]?.service.slug ?? "",
  );
  const [hoveredChildSlug, setHoveredChildSlug] = useState<string | null>(null);

  useEffect(() => {
    if (open && megaServices[0]) {
      setActiveSlug(megaServices[0].service.slug);
      setHoveredChildSlug(null);
    }
  }, [open, megaServices]);

  const activeItem = megaServices.find(
    ({ service }) => service.slug === activeSlug,
  );
  const activeService = activeItem?.service;
  const hoveredChild = activeService?.children?.find(
    (child) => child.slug === hoveredChildSlug,
  );
  const thirdLayerItems = hoveredChild ? getThirdLayerItems(hoveredChild) : [];

  return (
    <div className="flex min-h-[12rem] w-[46rem] max-w-[calc(100vw-1.5rem)] shrink-0 divide-x divide-x-reverse divide-white/10">
      <ul className="w-48 shrink-0 py-1" role="menu" aria-label="دسته‌بندی خدمات">
        {megaServices.map(({ service, label }) => {
          const isSelected = activeSlug === service.slug;
          const isPathActive = servicePathActive(pathname, service);

          return (
            <li
              key={service.slug}
              role="none"
              onMouseEnter={() => {
                setActiveSlug(service.slug);
                setHoveredChildSlug(null);
              }}
            >
              <div
                role="menuitem"
                aria-current={isSelected ? "true" : undefined}
                className={`flex w-full cursor-default items-center justify-between gap-2 border-b border-white/10 px-4 py-3 text-start text-sm transition last:border-b-0 hover:bg-white/5 hover:text-gold-400 ${
                  isSelected
                    ? "bg-white/5 text-gold-400"
                    : isPathActive
                      ? "text-gold-400/80"
                      : "text-white/85"
                }`}
              >
                <span className="whitespace-nowrap font-medium">{label}</span>
                <Chevron
                  className={isSelected ? "text-gold-400/70" : "text-white/40"}
                />
              </div>
            </li>
          );
        })}
      </ul>

      {activeService?.children?.length ? (
        <ul
          className="min-w-[18rem] shrink-0 py-1"
          role="menu"
          aria-label={activeItem?.label}
        >
          {activeService.children.map((child) => (
            <MegaMenuSubItem
              key={child.slug}
              child={child}
              pathname={pathname}
              onNavigate={onNavigate}
              isHovered={hoveredChildSlug === child.slug}
              onHover={() => setHoveredChildSlug(child.slug)}
            />
          ))}
        </ul>
      ) : (
        <div className="min-w-[18rem] shrink-0" aria-hidden />
      )}

      <ul
        className="min-w-[16rem] shrink-0 py-1"
        role="menu"
        aria-label={hoveredChild?.title ?? activeItem?.label}
        onMouseEnter={() => {
          if (hoveredChild) setHoveredChildSlug(hoveredChild.slug);
        }}
      >
        {thirdLayerItems.length > 0 && hoveredChild
          ? thirdLayerItems.map((post) => (
              <li key={post.slug} role="none">
                <Link
                  href={serviceHref(post.slug)}
                  onClick={onNavigate}
                  role="menuitem"
                  className="block whitespace-nowrap border-b border-white/[0.06] px-4 py-2.5 text-sm transition last:border-b-0 hover:bg-white/5 hover:text-gold-400 text-white/75"
                >
                  {post.title}
                </Link>
              </li>
            ))
          : null}
      </ul>
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
        className={`absolute left-1/2 top-full z-50 mt-1 w-[46rem] max-w-[calc(100vw-1.5rem)] origin-top rounded-xl border border-white/10 bg-navy-900 py-1 shadow-2xl shadow-black/40 transition-all duration-200 ${
          open
            ? "pointer-events-auto -translate-x-1/2 translate-y-0 opacity-100 visible"
            : "pointer-events-none -translate-x-1/2 -translate-y-1 opacity-0 invisible"
        }`}
      >
        <DesktopMegaMenu
          open={open}
          onNavigate={handleNavigate}
          megaServices={megaServices}
        />
      </div>
    </div>
  );
}
