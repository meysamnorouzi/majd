/** Local assets in /public/images */
export const assets = {
  logo: "/images/logo.png",
  /** Primary portrait — team cards, hero, profile sidebar */
  founderPortrait: "/images/jokar/jokar-award-portrait.jpg",
  /** Press interview still (gallery) */
  founderPressPortrait: "/images/jokar/jokar-portrait.jpg",
  /** Wide cinematic banners */
  founderBanner: "/images/jokar/jokar-podium.jpg",
  founderBoardroom: "/images/jokar/jokar-interview.jpg",
  founderArchitecture: "/images/jokar/jokar-award-portrait.jpg",
  founderReading: "/images/jokar/jokar-speaking.jpg",
  founderAward: "/images/jokar/jokar-award.jpg",
  founderSeated: "/images/jokar/jokar-seated.jpg",
  founderConversation: "/images/jokar/IMG_20240207_130217_159.jpg",
  founderNetworking: "/images/jokar/jokar-networking.jpg",
  webinarBanner: "/images/banner-webinar.jpg",
  awardBadge: "/images/award-1401.png",
  lawBooks: "/images/law-books.jpg",
  signingDocument: "/images/signing-document.jpg",
  businessDesk: "/images/business-desk.jpg",
  realEstate: "/images/real-estate.jpg",
  businessSuit: "/images/business-suit.jpg",
  onlineLearning: "/images/online-learning.jpg",
  classroom: "/images/classroom.jpg",
  studyDesk: "/images/study-desk.jpg",
} as const;

/** Crop so Jokar’s face stays in frame across portrait and landscape stills */
export function portraitObjectPosition(src: string): string | undefined {
  if (src.includes("jokar-portrait")) return "center 18%";
  if (src.includes("jokar-award-portrait")) return "center 12%";
  if (src.includes("jokar-networking")) return "72% 18%";
  if (src.includes("jokar-speaking")) return "78% 22%";
  if (src.includes("130217") || src.includes("jokar-conversation")) return "58% 32%";
  if (src.includes("jokar-seated")) return "38% 28%";
  if (src.includes("jokar-interview")) return "center 20%";
  if (src.includes("jokar-award")) return "center 18%";
  if (src.includes("jokar-podium")) return "center 28%";
  return undefined;
}

export const siteConfig = {
  name: "موسسه حقوقی مجد وکیل الرعایا",
  shortName: "موسسه حقوقی مجد",
  tagline: "پیشگام در ارائه خدمات حقوقی تخصصی",
  description:
    "موسسه حقوقی مجد وکیل الرعایا برترین موسسه حقوقی تهران در سال ۱۴۰۱ شناخته شد و مفتخر است موفق‌ترین پرونده‌ها را به سرانجام رسانده است. وکلای مجرب ما در صدها پرونده حقوقی و کیفری همراه شما هستند.",
  footerBlurb:
    "موسسه حقوقی مجد وکیل الرعایا برترین موسسه حقوقی تهران در سال ۱۴۰۱ شناخته شد و مفتخر است موفق‌ترین پرونده‌ها را به سرانجام رسانده.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://vakilmajd.com",
  city: "تهران",
  phones: ["۰۲۱۷۷۸۸۶۴۳۷", "۰۲۱۷۷۷۲۸۹۳۲"],
  phonesTel: ["+982177886437", "+982177728932"],
  email: "info@vakilmajd.com",
  address:
    "تهران، بزرگراه شهید باقری، نبش خیابان ۱۶۲ غربی، ساختمان پویا، پلاک ۴۳ واحد ۱۰",
  mapEmbedUrl:
    "https://maps.google.com/maps?q=PGM9%2BGCG%20District%204%2C%20Tehran%2C%20Tehran%20Province%2C%20Iran&t=m&z=18&output=embed&iwloc=near",
  mapTitle: "موقعیت موسسه حقوقی مجد — تهرانپارس، بزرگراه شهید باقری",
  workingHours: "شنبه تا چهارشنبه ۱۱ تا ۱۹",
  contactCta: "برای دریافت مشاوره هم‌اکنون تماس بگیرید",
  award: {
    year: "۱۴۰۱",
    title: "تندیس برترین موسسه حقوقی کشور",
    image: assets.awardBadge,
  },
  enamad: {
    id: "743215",
    code: "7SKG26yITKKlLDZN7zUOfiV9OfEPFjil",
    href: "https://trustseal.enamad.ir/?id=743215&Code=7SKG26yITKKlLDZN7zUOfiV9OfEPFjil",
    image:
      "https://trustseal.enamad.ir/logo.aspx?id=743215&Code=7SKG26yITKKlLDZN7zUOfiV9OfEPFjil",
  },
  social: {
    instagram: "https://instagram.com",
    telegram: "https://t.me",
    linkedin: "https://linkedin.com",
  },
};

export const stats = [
  { value: "۱۵+", label: "سال تجربه" },
  { value: "۵۰۰+", label: "پرونده موفق" },
  { value: "۲۰+", label: "وکیل متخصص" },
  { value: "۱", label: "تندیس برترین موسسه حقوقی کشور در سال ۱۴۰۱" },
];

export const practiceAreas = [
  "حقوق خصوصی و عمومی",
  "حقوق اقتصادی و تجارت بین‌الملل",
  "حقوق جزا و جرم‌شناسی",
  "حقوق بشر و محیط زیست",
  "حقوق بین‌الملل",
];

export const aboutContent = {
  title: "درباره موسسه حقوقی مجد",
  paragraphs: [
    "موسسه حقوقی مجد وکیل الرعایا برترین موسسه حقوقی تهران در سال ۱۴۰۱ شناخته شد و مفتخر است موفق‌ترین پرونده‌ها را به سرانجام رسانده است. این موسسه با بهره‌گیری از وکلای مجرب و متخصص، طیف گسترده‌ای از خدمات حقوقی را به اشخاص حقیقی و حقوقی ارائه می‌دهد.",
    "تیم ما در حوزه‌های حقوق خصوصی، جزا، خانواده، ملکی، تجارت بین‌الملل و حقوق بشر تخصص دارد و در صدها پرونده حقوقی و کیفری فعالیت درخشانی داشته است.",
    "همکاری با سفارتخانه‌ها و اتاق‌های بازرگانی کشورهایی چون سوئد، دانمارک و اسپانیا، گواه بر گستره بین‌المللی فعالیت‌های موسسه است. ما متعهد به ارائه مشاوره صادقانه، دفاع مستدل و همراهی موکل در تمامی مراحل دادرسی هستیم.",
  ],
  values: [
    {
      title: "تخصص و تجربه",
      text: "وکلای پایه یک با سابقه درخشان در پرونده‌های پیچیده",
    },
    {
      title: "محرمانگی",
      text: "حفظ کامل اطلاعات و اسرار موکلین",
    },
    {
      title: "شفافیت",
      text: "اطلاع‌رسانی روشن درباره هزینه‌ها و روند پرونده",
    },
    {
      title: "دسترسی",
      text: "مشاوره رایگان برای اشخاص نیازمند",
    },
  ],
};

export const navLinks = [
  { href: "/", label: "صفحه اصلی" },
  { href: "/family-lawyer/", label: "خدمات" },
  // Temporarily hidden — no payment gateway yet
  // { href: "/courses/", label: "دوره‌های آموزشی" },
  { href: "/team/", label: "اعضای تیم" },
  { href: "/blogs/", label: "مقالات" },
  // Temporarily hidden — no payment gateway yet
  // { href: "/shop/", label: "فروشگاه" },
  { href: "/about/", label: "درباره ما" },
  { href: "/contact/", label: "تماس با ما" },
];

