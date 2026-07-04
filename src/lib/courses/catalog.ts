import type { CourseFormatSlug } from "@/types";
import type { StoreProductView } from "@/lib/woocommerce/store-products-client";

export type CourseSortOption =
  | "newest"
  | "title-asc"
  | "title-desc"
  | "price-asc"
  | "price-desc";

export interface CourseCatalogFilters {
  search: string;
  formats: CourseFormatSlug[];
  levels: string[];
  priceMin: number | null;
  priceMax: number | null;
  sort: CourseSortOption;
}

export const defaultCourseCatalogFilters = (
  lockedFormat?: CourseFormatSlug,
): CourseCatalogFilters => ({
  search: "",
  formats: lockedFormat ? [lockedFormat] : [],
  levels: [],
  priceMin: null,
  priceMax: null,
  sort: "newest",
});

export function parseCoursePrice(price: string): number {
  const num = parseInt(price, 10);
  return Number.isNaN(num) ? 0 : num;
}

export function extractUniqueLevels(courses: StoreProductView[]): string[] {
  const levels = new Set<string>();
  for (const course of courses) {
    const level = course.majd.level?.trim();
    if (level) levels.add(level);
  }
  return [...levels].sort((a, b) => a.localeCompare(b, "fa"));
}

export function matchesCourseSearch(
  course: StoreProductView,
  query: string,
): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const haystack = [
    course.name,
    course.short_description,
    course.majd.duration,
    course.majd.level,
    ...course.majd.highlights,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(q);
}

export function filterCourses(
  courses: StoreProductView[],
  filters: CourseCatalogFilters,
  lockedFormat?: CourseFormatSlug,
): StoreProductView[] {
  return courses.filter((course) => {
    const formatSlug = (course.majd.format_slug ||
      "session-inperson") as CourseFormatSlug;

    if (lockedFormat && formatSlug !== lockedFormat) return false;

    if (
      filters.formats.length > 0 &&
      !filters.formats.includes(formatSlug)
    ) {
      return false;
    }

    if (
      filters.levels.length > 0 &&
      !filters.levels.includes(course.majd.level?.trim() ?? "")
    ) {
      return false;
    }

    if (!matchesCourseSearch(course, filters.search)) return false;

    const price = parseCoursePrice(course.price);
    if (filters.priceMin !== null && price > 0 && price < filters.priceMin) {
      return false;
    }
    if (filters.priceMax !== null && price > filters.priceMax) {
      return false;
    }

    return true;
  });
}

export function sortCourses(
  courses: StoreProductView[],
  sort: CourseSortOption,
): StoreProductView[] {
  const sorted = [...courses];

  switch (sort) {
    case "title-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name, "fa"));
    case "title-desc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name, "fa"));
    case "price-asc":
      return sorted.sort(
        (a, b) => parseCoursePrice(a.price) - parseCoursePrice(b.price),
      );
    case "price-desc":
      return sorted.sort(
        (a, b) => parseCoursePrice(b.price) - parseCoursePrice(a.price),
      );
    case "newest":
    default:
      return sorted.sort((a, b) => b.id - a.id);
  }
}

export function applyCourseCatalog(
  courses: StoreProductView[],
  filters: CourseCatalogFilters,
  lockedFormat?: CourseFormatSlug,
): StoreProductView[] {
  return sortCourses(
    filterCourses(courses, filters, lockedFormat),
    filters.sort,
  );
}

export function countActiveFilters(
  filters: CourseCatalogFilters,
  lockedFormat?: CourseFormatSlug,
): number {
  let count = 0;
  if (filters.search.trim()) count++;
  if (!lockedFormat && filters.formats.length > 0) count++;
  if (filters.levels.length > 0) count++;
  if (filters.priceMin !== null || filters.priceMax !== null) count++;
  return count;
}
