import type { CourseFormatSlug } from "@/types";

/** Course formats that include a Spot Player offline license */
export const SPOTPLAYER_FORMAT_SLUGS: CourseFormatSlug[] = [
  "online-offline",
  "hybrid-full",
];

/** Map retired WooCommerce category slugs to the current format slugs */
export const LEGACY_FORMAT_SLUG_MAP: Record<string, CourseFormatSlug> = {
  hozoori: "session-inperson",
  "offline-spotplayer": "online-offline",
};

export function normalizeFormatSlug(
  slug: string | null | undefined,
): CourseFormatSlug | "" {
  if (!slug) return "";
  const mapped = LEGACY_FORMAT_SLUG_MAP[slug] ?? (slug as CourseFormatSlug);
  const valid: CourseFormatSlug[] = [
    "online-webinar",
    "online-offline",
    "hybrid-full",
    "session-hybrid",
    "session-inperson",
  ];
  return valid.includes(mapped) ? mapped : "";
}

export function hasSpotPlayerLicense(
  slug: CourseFormatSlug | string | null | undefined,
): boolean {
  if (!slug) return false;
  return SPOTPLAYER_FORMAT_SLUGS.includes(slug as CourseFormatSlug);
}

export function usesSkyroom(
  slug: CourseFormatSlug | string | null | undefined,
): boolean {
  if (!slug) return false;
  return (
    slug === "online-webinar" ||
    slug === "online-offline" ||
    slug === "hybrid-full" ||
    slug === "session-hybrid"
  );
}
