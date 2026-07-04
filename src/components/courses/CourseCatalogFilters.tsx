"use client";

import Link from "next/link";
import type { CourseFormatSlug } from "@/types";
import { courseFormats } from "@/data/courses";
import { getAccent } from "@/components/courses/accentStyles";
import { formatIcon } from "@/components/courses/FormatIcons";
import {
  countActiveFilters,
  type CourseCatalogFilters,
} from "@/lib/courses/catalog";
import { formatStorePrice } from "@/lib/woocommerce/format-price";

const PRICE_PRESETS = [
  { label: "همه قیمت‌ها", min: null, max: null },
  { label: "زیر ۳ میلیون", min: null, max: 3_000_000 },
  { label: "۳ تا ۷ میلیون", min: 3_000_000, max: 7_000_000 },
  { label: "۷ تا ۱۲ میلیون", min: 7_000_000, max: 12_000_000 },
  { label: "بالای ۱۲ میلیون", min: 12_000_000, max: null },
] as const;

interface CourseCatalogFiltersProps {
  filters: CourseCatalogFilters;
  availableLevels: string[];
  lockedFormat?: CourseFormatSlug;
  onChange: (filters: CourseCatalogFilters) => void;
  onReset: () => void;
  className?: string;
}

export function CourseCatalogFiltersPanel({
  filters,
  availableLevels,
  lockedFormat,
  onChange,
  onReset,
  className = "",
}: CourseCatalogFiltersProps) {
  const activeCount = countActiveFilters(filters, lockedFormat);

  function toggleFormat(slug: CourseFormatSlug) {
    const next = filters.formats.includes(slug)
      ? filters.formats.filter((s) => s !== slug)
      : [...filters.formats, slug];
    onChange({ ...filters, formats: next });
  }

  function toggleLevel(level: string) {
    const next = filters.levels.includes(level)
      ? filters.levels.filter((l) => l !== level)
      : [...filters.levels, level];
    onChange({ ...filters, levels: next });
  }

  function setPricePreset(min: number | null, max: number | null) {
    onChange({ ...filters, priceMin: min, priceMax: max });
  }

  const pricePresetActive = (min: number | null, max: number | null) =>
    filters.priceMin === min && filters.priceMax === max;

  return (
    <aside
      className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <h2 className="text-lg font-bold text-navy-900">فیلتر دوره‌ها</h2>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-semibold text-gold-600 hover:text-gold-700"
          >
            پاک کردن ({activeCount.toLocaleString("fa-IR")})
          </button>
        )}
      </div>

      {!lockedFormat && (
        <div className="mt-6">
          <h3 className="text-sm font-bold text-navy-900">نوع دوره</h3>
          <ul className="mt-3 space-y-2">
            {courseFormats.map((format) => {
              const Icon = formatIcon(format.slug);
              const accent = getAccent(format);
              const checked = filters.formats.includes(format.slug);
              return (
                <li key={format.slug}>
                  <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-transparent px-2 py-2 transition hover:bg-cream/80 has-[:checked]:border-gold-500/30 has-[:checked]:bg-gold-500/5">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleFormat(format.slug)}
                      className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 text-gold-500 focus:ring-gold-500/30"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${accent.icon}`}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="text-sm font-medium text-navy-900">
                          {format.badge}
                        </span>
                      </span>
                      <Link
                        href={`/courses/${format.slug}/`}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-1 block text-xs text-slate-500 hover:text-gold-600"
                      >
                        صفحه اختصاصی ←
                      </Link>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {lockedFormat && (
        <div className="mt-6 rounded-xl bg-cream/80 p-4">
          <p className="text-xs font-semibold text-slate-500">نوع دوره</p>
          <p className="mt-1 text-sm font-bold text-navy-900">
            {courseFormats.find((f) => f.slug === lockedFormat)?.badge}
          </p>
          <Link
            href="/courses/"
            className="mt-2 inline-block text-xs font-semibold text-gold-600 hover:text-gold-700"
          >
            مشاهده همه دوره‌ها
          </Link>
        </div>
      )}

      {availableLevels.length > 0 && (
        <div className="mt-6 border-t border-slate-100 pt-6">
          <h3 className="text-sm font-bold text-navy-900">سطح دوره</h3>
          <ul className="mt-3 space-y-2">
            {availableLevels.map((level) => (
              <li key={level}>
                <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 hover:bg-cream/80">
                  <input
                    type="checkbox"
                    checked={filters.levels.includes(level)}
                    onChange={() => toggleLevel(level)}
                    className="h-4 w-4 rounded border-slate-300 text-gold-500 focus:ring-gold-500/30"
                  />
                  <span className="text-sm text-slate-700">{level}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 border-t border-slate-100 pt-6">
        <h3 className="text-sm font-bold text-navy-900">محدوده قیمت</h3>
        <ul className="mt-3 space-y-2">
          {PRICE_PRESETS.map((preset) => (
            <li key={preset.label}>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 hover:bg-cream/80">
                <input
                  type="radio"
                  name="price-preset"
                  checked={pricePresetActive(preset.min, preset.max)}
                  onChange={() => setPricePreset(preset.min, preset.max)}
                  className="h-4 w-4 border-slate-300 text-gold-500 focus:ring-gold-500/30"
                />
                <span className="text-sm text-slate-700">{preset.label}</span>
              </label>
            </li>
          ))}
        </ul>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div>
            <label className="mb-1 block text-xs text-slate-500">حداقل</label>
            <input
              type="number"
              min={0}
              placeholder="۰"
              value={filters.priceMin ?? ""}
              onChange={(e) =>
                onChange({
                  ...filters,
                  priceMin: e.target.value ? Number(e.target.value) : null,
                })
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-gold-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">حداکثر</label>
            <input
              type="number"
              min={0}
              placeholder="∞"
              value={filters.priceMax ?? ""}
              onChange={(e) =>
                onChange({
                  ...filters,
                  priceMax: e.target.value ? Number(e.target.value) : null,
                })
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-gold-500"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}

export function CourseCatalogActiveChips({
  filters,
  lockedFormat,
  onChange,
}: {
  filters: CourseCatalogFilters;
  lockedFormat?: CourseFormatSlug;
  onChange: (filters: CourseCatalogFilters) => void;
}) {
  const chips: { label: string; onRemove: () => void }[] = [];

  if (filters.search.trim()) {
    chips.push({
      label: `جستجو: ${filters.search}`,
      onRemove: () => onChange({ ...filters, search: "" }),
    });
  }

  if (!lockedFormat) {
    for (const slug of filters.formats) {
      const format = courseFormats.find((f) => f.slug === slug);
      if (format) {
        chips.push({
          label: format.badge,
          onRemove: () =>
            onChange({
              ...filters,
              formats: filters.formats.filter((s) => s !== slug),
            }),
        });
      }
    }
  }

  for (const level of filters.levels) {
    chips.push({
      label: level,
      onRemove: () =>
        onChange({
          ...filters,
          levels: filters.levels.filter((l) => l !== level),
        }),
    });
  }

  if (filters.priceMin !== null || filters.priceMax !== null) {
    const min = filters.priceMin
      ? formatStorePrice(String(filters.priceMin))
      : null;
    const max = filters.priceMax
      ? formatStorePrice(String(filters.priceMax))
      : null;
    let label = "قیمت: ";
    if (min && max) label += `${min} – ${max}`;
    else if (min) label += `از ${min}`;
    else if (max) label += `تا ${max}`;
    chips.push({
      label,
      onRemove: () =>
        onChange({ ...filters, priceMin: null, priceMax: null }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <button
          key={chip.label}
          type="button"
          onClick={chip.onRemove}
          className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-xs font-medium text-navy-900 transition hover:bg-gold-500/20"
        >
          {chip.label}
          <span aria-hidden className="text-gold-600">
            ×
          </span>
        </button>
      ))}
    </div>
  );
}
