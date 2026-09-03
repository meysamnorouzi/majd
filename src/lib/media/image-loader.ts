"use client";

import manifest from "./image-manifest.json";

type ManifestEntry = { widths: number[] };
type Manifest = Record<string, ManifestEntry>;

const IMAGE_MANIFEST = manifest as Manifest;

function pickWidth(widths: number[], requested: number): number {
  for (const width of widths) {
    if (width >= requested) return width;
  }
  return widths[widths.length - 1];
}

function optimizedLocalSrc(src: string, width: number): string | null {
  const entry = IMAGE_MANIFEST[src];
  if (!entry?.widths?.length) return null;
  const chosen = pickWidth(entry.widths, width);
  const withoutExt = src.replace(/\.(jpe?g|png|webp|gif|avif)$/i, "");
  return `/opt${withoutExt}-w${chosen}.webp`;
}

export default function imageLoader({
  src,
  width,
}: {
  src: string;
  width: number;
}): string {
  if (!src) return src;
  if (src.startsWith("/opt/")) return src;
  if (src.startsWith("/") && !src.startsWith("//")) {
    return optimizedLocalSrc(src, width) ?? src;
  }
  return src;
}
