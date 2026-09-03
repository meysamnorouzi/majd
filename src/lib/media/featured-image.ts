import { rewriteWpMediaUrl } from "@/lib/wordpress/config";
import type { WpFeaturedMedia } from "@/types";

const DEFAULT_MIN_WIDTH = 1080;

function collectCandidates(media: WpFeaturedMedia): { url: string; width: number; webp: boolean }[] {
  const candidates: { url: string; width: number; webp: boolean }[] = [];
  const isWebp = (mime?: string, url?: string) =>
    Boolean(
      mime?.includes("webp") ||
        url?.toLowerCase().endsWith(".webp"),
    );

  if (media.source_url) {
    candidates.push({
      url: media.source_url,
      width: media.media_details?.width ?? 99999,
      webp: isWebp(media.mime_type, media.source_url),
    });
  }

  const sizes = media.media_details?.sizes;
  if (sizes) {
    for (const size of Object.values(sizes)) {
      if (!size?.source_url) continue;
      candidates.push({
        url: size.source_url,
        width: size.width ?? 0,
        webp: isWebp(size.mime_type, size.source_url),
      });
    }
  }

  return candidates.filter((c) => c.width > 0);
}

/** Smallest WordPress derivative that still covers `minWidth` (prefers WebP). */
export function pickFeaturedImageUrl(
  media: WpFeaturedMedia | undefined,
  minWidth = DEFAULT_MIN_WIDTH,
): string | undefined {
  if (!media) return undefined;
  const candidates = collectCandidates(media);
  if (!candidates.length) {
    return media.source_url ? rewriteWpMediaUrl(media.source_url) : undefined;
  }

  candidates.sort((a, b) => a.width - b.width || Number(b.webp) - Number(a.webp));
  const wideEnough = candidates.filter((c) => c.width >= minWidth);
  const pool = wideEnough.length ? wideEnough : [candidates[candidates.length - 1]];
  const webp = pool.find((c) => c.webp);
  return rewriteWpMediaUrl((webp ?? pool[0]).url);
}
