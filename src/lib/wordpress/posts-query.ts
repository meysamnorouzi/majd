export type BlogPostSortOption =
  | "newest"
  | "oldest"
  | "title-asc"
  | "title-desc";

export interface FetchPostsOptions {
  categoryId?: number;
  search?: string;
  sort?: BlogPostSortOption;
}

export interface BlogPostListItem {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image?: string;
}

export const defaultBlogPostSort: BlogPostSortOption = "newest";

function blogSortToWpParams(sort: BlogPostSortOption): {
  orderby: string;
  order: "asc" | "desc";
} {
  switch (sort) {
    case "oldest":
      return { orderby: "date", order: "asc" };
    case "title-asc":
      return { orderby: "title", order: "asc" };
    case "title-desc":
      return { orderby: "title", order: "desc" };
    case "newest":
    default:
      return { orderby: "date", order: "desc" };
  }
}

export function buildPostsQuery(
  limit: number,
  options?: FetchPostsOptions,
): string {
  const params: string[] = [`per_page=${limit}`, "_embed"];

  if (options?.categoryId) {
    params.push(`categories=${options.categoryId}`);
  }

  const { orderby, order } = blogSortToWpParams(
    options?.sort ?? defaultBlogPostSort,
  );
  params.push(`orderby=${orderby}`, `order=${order}`);

  return params.join("&");
}

export function matchesBlogPostSearch(
  post: BlogPostListItem,
  query: string,
): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  return post.title.toLowerCase().includes(q);
}

export function applyPostsListOptions(
  posts: BlogPostListItem[],
  options: FetchPostsOptions | undefined,
  limit: number,
): BlogPostListItem[] {
  let result = posts;

  if (options?.search?.trim()) {
    result = result.filter((post) =>
      matchesBlogPostSearch(post, options.search!),
    );
  }

  if (options?.sort) {
    result = sortBlogPosts(result, options.sort);
  }

  return result.slice(0, limit);
}

/** WordPress search matches title, content, and excerpt — we only want title. */
export const postsFetchLimitWhenSearching = 100;

export function sortBlogPosts(
  posts: BlogPostListItem[],
  sort: BlogPostSortOption,
): BlogPostListItem[] {
  const sorted = [...posts];

  switch (sort) {
    case "title-asc":
      return sorted.sort((a, b) => a.title.localeCompare(b.title, "fa"));
    case "title-desc":
      return sorted.sort((a, b) => b.title.localeCompare(a.title, "fa"));
    case "oldest":
      return sorted.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );
    case "newest":
    default:
      return sorted.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
  }
}

export function applyFallbackBlogPosts(
  posts: BlogPostListItem[],
  options?: FetchPostsOptions,
): BlogPostListItem[] {
  let result = posts;

  if (options?.search?.trim()) {
    result = result.filter((post) =>
      matchesBlogPostSearch(post, options.search!),
    );
  }

  if (options?.sort) {
    result = sortBlogPosts(result, options.sort);
  }

  return result;
}

export function hasPostsQueryFilters(options?: FetchPostsOptions): boolean {
  return Boolean(
    options?.categoryId ||
      options?.search?.trim() ||
      (options?.sort && options.sort !== defaultBlogPostSort),
  );
}
