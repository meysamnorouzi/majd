import type { CourseFormat, CourseFormatSlug, CourseItem } from "@/types";
import { normalizeFormatSlug } from "@/lib/courses/format-utils";
import { courseFormats } from "@/data/course-formats-data";

export { courseFormats };

export const coursesIntro = {
  title: "دوره‌های آموزشی حقوقی",
  description:
    "موسسه حقوقی مجد با بهره‌گیری از تجربه وکلای پایه یک، دوره‌های تخصصی را در پنج قالب — از وبینار آنلاین تا دوره‌های ترکیبی حضوری، اسکای‌روم و اسپات‌پلیر — برگزار می‌کند.",
  highlights: [
    "اساتید وکیل پایه یک و متخصص",
    "محتوای به‌روز مطابق قوانین جاری",
    "گواهی پایان دوره معتبر",
    "پشتیبانی آموزشی پس از دوره",
  ],
};

export const enrollmentSteps = [
  {
    step: "۱",
    title: "انتخاب دوره",
    text: "نوع دوره و فرمت آموزشی مورد نظر خود را از میان وبینار، دوره ترکیبی یا نشست حضوری انتخاب کنید.",
  },
  {
    step: "۲",
    title: "افزودن به سبد",
    text: "دوره را به سبد خرید اضافه کنید و اطلاعات ثبت‌نام را در صفحه تسویه حساب وارد نمایید.",
  },
  {
    step: "۳",
    title: "پرداخت آنلاین",
    text: "پس از تأیید سفارش، به درگاه بانکی هدایت می‌شوید. پس از پرداخت موفق، دسترسی دوره فعال می‌شود.",
  },
  {
    step: "۴",
    title: "شروع یادگیری",
    text: "در کلاس حضوری حاضر شوید، در اسکای‌روم شرکت کنید، یا ویدیوها را در اسپات‌پلیر تماشا کنید.",
  },
];

export const coursesFAQ = [
  {
    q: "آیا برای شرکت در دوره‌ها نیاز به مدرک حقوقی دارم؟",
    a: "خیر. دوره‌های مقدماتی برای عموم و دوره‌های تخصصی برای وکلا، کارآموزان و فعالان حقوقی طراحی شده‌اند. سطح هر دوره در توضیحات ذکر شده است.",
  },
  {
    q: "اسپات پلیر چیست و چگونه کار می‌کند؟",
    a: "اسپات پلیر نرم‌افزار پخش امن ویدیوهای آموزشی است. در دوره‌هایی که شامل دسترسی آفلاین هستند، پس از خرید لایسنس اختصاصی روی دستگاه شما فعال می‌شود و می‌توانید در زمان دلخواه محتوا را مشاهده کنید.",
  },
  {
    q: "اسکای‌روم چیست؟",
    a: "اسکای‌روم بستر برگزاری کلاس آنلاین و لایو استریم موسسه است. شرکت‌کنندگان دوره‌های آنلاین و ترکیبی از طریق لینک اختصاصی وارد اتاق مجازی می‌شوند و به‌صورت زنده در جلسات شرکت می‌کنند.",
  },
  {
    q: "آیا همه دوره‌ها ضبط آفلاین دارند؟",
    a: "خیر. وبینار آنلاین و نشست حضوری + آنلاین بدون لایسنس آفلاین هستند. دوره‌های آنلاین + آفلاین و دوره‌های حضوری + آنلاین + آفلاین شامل لایسنس اسپات‌پلیر برای تماشای بعدی می‌شوند.",
  },
  {
    q: "گواهی پایان دوره صادر می‌شود؟",
    a: "بله. پس از گذراندن حد نصاب حضور یا تکمیل محتوای آفلاین، گواهی معتبر موسسه حقوقی مجد صادر می‌گردد.",
  },
];

export function getCourseFormat(slug: string) {
  const normalized = normalizeFormatSlug(slug);
  if (!normalized) return null;
  return courseFormats.find((f) => f.slug === normalized) ?? null;
}

export function getCourseItem(
  formatSlug: string,
  courseSlug: string,
): { format: CourseFormat; course: CourseItem } | null {
  const format = getCourseFormat(formatSlug);
  if (!format) return null;
  const course = format.courses.find((c) => c.slug === courseSlug);
  if (!course) return null;
  return { format, course };
}

export function getAllCoursePaths(): { slug: string; courseSlug: string }[] {
  return courseFormats.flatMap((format) =>
    format.courses.map((course) => ({
      slug: format.slug,
      courseSlug: course.slug,
    })),
  );
}

export function getCourseDetailPath(
  formatSlug: CourseFormatSlug,
  courseSlug: string,
  productSlug?: string,
) {
  if (productSlug) {
    return `/courses/view/${productSlug}/`;
  }
  return `/courses/view/${courseSlug}/`;
}
