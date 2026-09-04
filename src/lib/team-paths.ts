export const TEAM_LIST_PATH = "/team/";

export function teamMemberPath(slug: string): string {
  return `/team/${slug}/`;
}

export function teamMemberSlugFromPathname(pathname: string): string {
  const normalized = pathname.replace(/\/$/, "");
  if (!normalized.startsWith("/team")) return "";
  const rest = normalized.slice("/team".length).replace(/^\//, "");
  if (!rest || rest === "view") return "";
  return decodeURIComponent(rest.split("/")[0] ?? "");
}
