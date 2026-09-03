import { fallbackTeamMembers } from "@/data/site";
import { normalizeWpSlug } from "@/lib/wordpress/categories";
import { pickFeaturedImageUrl } from "@/lib/media/featured-image";
import {
  rewriteWpMediaUrl,
  wpApiUrl,
  wpServerHeaders,
} from "@/lib/wordpress/config";
import { wpFetch } from "@/lib/wordpress/fetch";
import type {
  TeamMember,
  TeamMemberGalleryItem,
  TeamMemberSocial,
  TeamMemberVideoItem,
  WpTeamMember,
} from "@/types";

/** WordPress team CPT — enable with NEXT_PUBLIC_USE_WP_TEAM=true */
export const USE_WP_TEAM = process.env.NEXT_PUBLIC_USE_WP_TEAM === "true";

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8211;/g, "—")
    .replace(/&[a-z]+;/gi, "")
    .trim();
}

function getFeaturedImage(post: WpTeamMember): string | undefined {
  return pickFeaturedImageUrl(post._embedded?.["wp:featuredmedia"]?.[0], 800);
}

function normalizeSocial(
  social: TeamMemberSocial | Record<string, never> | undefined,
): TeamMemberSocial | undefined {
  if (!social || typeof social !== "object") return undefined;
  const out: TeamMemberSocial = {};
  if (social.instagram?.trim()) out.instagram = social.instagram.trim();
  if (social.telegram?.trim()) out.telegram = social.telegram.trim();
  if (social.linkedin?.trim()) out.linkedin = social.linkedin.trim();
  return Object.keys(out).length ? out : undefined;
}

function normalizeGallery(
  items: TeamMemberGalleryItem[] | undefined,
): TeamMemberGalleryItem[] | undefined {
  if (!items?.length) return undefined;
  const gallery = items
    .filter((item) => item?.src?.trim())
    .map((item) => ({
      src: rewriteWpMediaUrl(item.src.trim()),
      alt: item.alt?.trim() || "",
    }));
  return gallery.length ? gallery : undefined;
}

function normalizeVideoGallery(
  items: TeamMemberVideoItem[] | undefined,
): TeamMemberVideoItem[] | undefined {
  if (!items?.length) return undefined;
  const videos = items
    .filter((item) => item?.src?.trim())
    .map((item) => ({
      src: rewriteWpMediaUrl(item.src.trim()),
      title: item.title?.trim() || "",
      poster: item.poster?.trim()
        ? rewriteWpMediaUrl(item.poster.trim())
        : undefined,
    }));
  return videos.length ? videos : undefined;
}

export function mapWpTeamMember(post: WpTeamMember): TeamMember {
  const meta = post.majd_team ?? {};
  const slug = normalizeWpSlug(post.slug);
  const image = getFeaturedImage(post) ?? "";
  const bannerImage = meta.bannerImage
    ? rewriteWpMediaUrl(meta.bannerImage)
    : undefined;

  return {
    id: String(post.id),
    slug,
    name: stripHtml(post.title.rendered),
    role: meta.role?.trim() || "",
    specialty: meta.specialty?.trim() || "",
    bio: stripHtml(post.excerpt.rendered),
    fullBio: meta.fullBio?.length
      ? meta.fullBio
      : meta.role
        ? [stripHtml(post.excerpt.rendered)].filter(Boolean)
        : [],
    image,
    bannerImage,
    gallery: normalizeGallery(meta.gallery),
    videoGallery: normalizeVideoGallery(meta.videoGallery),
    education: meta.education?.trim() || "",
    birthDate: meta.birthDate?.trim() || undefined,
    experienceYears: meta.experienceYears?.trim() || "",
    areasOfPractice: meta.areasOfPractice ?? [],
    achievements: meta.achievements ?? [],
    phone: meta.phone?.trim() || undefined,
    email: meta.email?.trim() || undefined,
    location: meta.location?.trim() || undefined,
    social: normalizeSocial(meta.social),
  };
}

async function fetchJson<T>(
  url: string,
  options?: { headers?: HeadersInit; cache?: RequestCache },
): Promise<T | null> {
  const res = await wpFetch(url, {
    cache: options?.cache ?? "no-store",
    headers: options?.headers,
  });
  if (!res?.ok) return null;
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

const TEAM_QUERY =
  "/wp-json/wp/v2/team?per_page=100&_embed&status=publish&orderby=menu_order&order=asc";

async function fetchAllTeamPosts(
  headers?: HeadersInit,
  cache: RequestCache = "no-store",
): Promise<WpTeamMember[]> {
  const posts: WpTeamMember[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages && page <= 10) {
    const url = wpApiUrl(`${TEAM_QUERY}&page=${page}`);
    const res = await wpFetch(url, { cache, headers });
    if (!res?.ok) break;

    const batch = (await res.json()) as WpTeamMember[];
    posts.push(...batch);
    totalPages = Number(res.headers.get("X-WP-TotalPages") || "1");
    page += 1;
    if (!batch.length) break;
  }

  return posts;
}

export async function fetchTeamClient(): Promise<TeamMember[]> {
  if (!USE_WP_TEAM) return fallbackTeamMembers;

  const posts = await fetchAllTeamPosts();
  if (posts.length) {
    return posts.map(mapWpTeamMember);
  }
  return fallbackTeamMembers;
}

export async function fetchTeamMemberBySlugClient(
  slug: string,
): Promise<TeamMember | null> {
  const normalized = normalizeWpSlug(slug);

  if (!USE_WP_TEAM) {
    return (
      fallbackTeamMembers.find(
        (m) => m.slug === normalized || m.slug === slug,
      ) ?? null
    );
  }

  const data = await fetchJson<WpTeamMember[]>(
    wpApiUrl(
      `/wp-json/wp/v2/team?slug=${encodeURIComponent(normalized)}&_embed&status=publish`,
    ),
  );

  if (data?.[0]) {
    return mapWpTeamMember(data[0]);
  }

  return (
    fallbackTeamMembers.find(
      (m) => m.slug === normalized || m.slug === slug,
    ) ?? null
  );
}

export async function getTeamFromWp(): Promise<{
  team: TeamMember[];
  fromWordPress: boolean;
}> {
  if (!USE_WP_TEAM) {
    return {
      team: fallbackTeamMembers,
      fromWordPress: false,
    };
  }

  const posts = await fetchAllTeamPosts(wpServerHeaders(), "force-cache");
  if (posts.length) {
    return {
      team: posts.map(mapWpTeamMember),
      fromWordPress: true,
    };
  }

  return {
    team: fallbackTeamMembers,
    fromWordPress: false,
  };
}

export async function getTeamMemberBySlugFromWp(
  slug: string,
): Promise<TeamMember | null> {
  const normalized = normalizeWpSlug(slug);

  if (!USE_WP_TEAM) {
    return (
      fallbackTeamMembers.find(
        (m) => m.slug === normalized || m.slug === slug,
      ) ?? null
    );
  }

  const data = await fetchJson<WpTeamMember[]>(
    wpApiUrl(
      `/wp-json/wp/v2/team?slug=${encodeURIComponent(normalized)}&_embed&status=publish`,
    ),
    { headers: wpServerHeaders(), cache: "force-cache" },
  );

  if (data?.[0]) {
    return mapWpTeamMember(data[0]);
  }

  const { team } = await getTeamFromWp();
  return team.find((m) => m.slug === normalized || m.slug === slug) ?? null;
}

export async function getAllTeamSlugsFromWp(): Promise<string[]> {
  const { team } = await getTeamFromWp();
  return team.map((m) => m.slug);
}

export function toLawyerOptions(members: TeamMember[]) {
  return members.map((m) => ({ slug: m.slug, name: m.name }));
}
