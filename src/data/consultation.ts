/** Consultation area options — used across contact forms */
export const CONSULTATION_AREAS = [
  "مشاوره حقوقی",
  "وکالت در دعاوی",
  "حقوق خانواده",
  "حقوق ملکی",
  "حقوق کیفری",
  "حقوق تجاری و قراردادها",
  "وصول مطالبات",
  "حقوق بین‌الملل",
  "دوره آموزشی",
  "سایر",
] as const;

export type ConsultationArea = (typeof CONSULTATION_AREAS)[number];

export const CONSULTATION_AREA_LABEL = "در چه زمینه‌ای نیاز به مشاوره دارید؟";

export const LAWYER_PICKER_LABEL = "ترجیح می‌دهید با کدام وکیل مشاوره کنید؟";

export const LAWYER_ANY_OPTION = "هر وکیل موجود";
