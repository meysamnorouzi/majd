import { wpApiUrl } from "@/lib/wordpress/config";
import type { BlogCategory, WpCategory } from "@/types";

const HIDDEN_SLUGS = new Set(["uncategorized", "uncategorised"]);

/** WP often returns percent-encoded Persian slugs — normalize for clean URLs */
export function normalizeWpSlug(slug: string): string {
  let current = slug.trim();
  for (let i = 0; i < 3; i++) {
    try {
      const decoded = decodeURIComponent(current);
      if (decoded === current) break;
      current = decoded;
    } catch {
      break;
    }
  }
  return current;
}

export function mapCategory(c: WpCategory): Omit<BlogCategory, "children"> {
  return {
    id: c.id,
    slug: normalizeWpSlug(c.slug),
    name: c.name,
    description: c.description ?? "",
    count: c.count ?? 0,
    parent: c.parent ?? 0,
  };
}

/** Build a parent → children tree from a flat WP categories list */
export function buildCategoryTree(flat: WpCategory[]): BlogCategory[] {
  const nodes = new Map<number, BlogCategory>();

  for (const raw of flat) {
    const mapped = mapCategory(raw);
    if (HIDDEN_SLUGS.has(mapped.slug)) continue;
    nodes.set(raw.id, { ...mapped, children: [] });
  }

  const roots: BlogCategory[] = [];

  for (const node of nodes.values()) {
    const parent = node.parent ? nodes.get(node.parent) : undefined;
    if (parent) {
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }

  const sortByName = (a: BlogCategory, b: BlogCategory) =>
    a.name.localeCompare(b.name, "fa");

  const sortTree = (list: BlogCategory[]) => {
    list.sort(sortByName);
    for (const item of list) sortTree(item.children);
  };

  sortTree(roots);
  return roots;
}

export function flattenCategories(tree: BlogCategory[]): BlogCategory[] {
  const out: BlogCategory[] = [];
  for (const node of tree) {
    out.push(node);
    if (node.children.length) out.push(...flattenCategories(node.children));
  }
  return out;
}

export function findCategoryBySlug(
  tree: BlogCategory[],
  slug: string,
): BlogCategory | null {
  const target = normalizeWpSlug(slug);
  for (const node of tree) {
    if (node.slug === target || normalizeWpSlug(node.slug) === target) {
      return node;
    }
    const nested = findCategoryBySlug(node.children, target);
    if (nested) return nested;
  }
  return null;
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/** Client-side: fetch categories and return a nested tree */
let categoriesClientPromise: Promise<BlogCategory[]> | null = null;

export async function fetchCategoriesClient(): Promise<BlogCategory[]> {
  categoriesClientPromise ??= (async () => {
    const data = await fetchJson<WpCategory[]>(
      wpApiUrl(
        "/wp-json/wp/v2/categories?per_page=100&hide_empty=true&orderby=name&order=asc",
      ),
    );
    if (!data?.length) return [];
    return buildCategoryTree(data);
  })();
  return categoriesClientPromise;
}
