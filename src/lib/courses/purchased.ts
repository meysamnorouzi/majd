import { courseFormats } from "@/data/courses";
import { hasSpotPlayerLicense } from "@/lib/courses/format-utils";
import type {
  CourseFormat,
  CourseItem,
  CustomerOrder,
  PurchasedCourse,
} from "@/types";

export function findCourseByProductSlug(
  productSlug: string,
): { course: CourseItem; format: CourseFormat } | null {
  for (const format of courseFormats) {
    const course = format.courses.find((c) => c.productSlug === productSlug);
    if (course) return { course, format };
  }
  return null;
}

export function isSpotPlayerCourse(productSlug: string): boolean {
  const match = findCourseByProductSlug(productSlug);
  return match ? hasSpotPlayerLicense(match.format.slug) : false;
}

export function ordersToPurchasedCourses(
  orders: CustomerOrder[],
): PurchasedCourse[] {
  const purchased: PurchasedCourse[] = [];

  for (const order of orders) {
    for (const item of order.items) {
      const match = findCourseByProductSlug(item.product_slug);
      purchased.push({
        orderId: order.id,
        orderDate: order.date,
        orderStatus: order.status,
        licenseStatus: order.license_status,
        spotplayerLicense: order.spotplayer_license,
        spotplayerNotes: order.spotplayer_notes,
        course: match?.course ?? null,
        format: match?.format ?? null,
        productSlug: item.product_slug,
        productName: item.name,
      });
    }
  }

  return purchased.sort(
    (a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime(),
  );
}

export function isSpotPlayerProduct(
  productSlug: string,
  formatSlug?: string | null,
): boolean {
  if (hasSpotPlayerLicense(formatSlug)) return true;
  return isSpotPlayerCourse(productSlug);
}

export function getSpotPlayerCourses(
  purchased: PurchasedCourse[],
): PurchasedCourse[] {
  return purchased.filter(
    (p) =>
      hasSpotPlayerLicense(p.format?.slug) || isSpotPlayerCourse(p.productSlug),
  );
}

export const licenseStatusLabels: Record<
  PurchasedCourse["licenseStatus"],
  string
> = {
  ready: "لایسنس آماده",
  license_pending: "در انتظار صدور لایسنس",
  payment_pending: "در انتظار تأیید پرداخت",
};

export const orderStatusLabels: Record<string, string> = {
  pending: "در انتظار پرداخت",
  processing: "در حال پردازش",
  "on-hold": "معلق",
  completed: "تکمیل شده",
  cancelled: "لغو شده",
  refunded: "مسترد شده",
  failed: "ناموفق",
};
