export const WP_URL =
  process.env.NEXT_PUBLIC_WP_URL ?? "https://admin.vakilmajd.com";

export function wpApiUrl(path: string): string {
  return `${WP_URL.replace(/\/$/, "")}${path}`;
}
