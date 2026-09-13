import { assets } from "@/data/site";
import type { PillarLanding } from "@/data/pillar-landings";
import type { ServiceCategoryPrefix } from "@/lib/service-paths";

export interface PillarDefinition {
  prefix: ServiceCategoryPrefix;
  title: string;
  menuLabel: string;
  excerpt: string;
  intro: string;
  body: string;
  image: string;
  icon: string;
  keywords: string[];
  /** WordPress category slugs used to pull related articles */
  blogCategorySlugs: string[];
}

export const PILLARS: PillarDefinition[] = [
  {
    prefix: "family-lawyer",
    title: "وکیل خانواده",
    menuLabel: "وکیل خانواده",
    excerpt:
      "بهترین وکلای حوزه خانواده؛ مشاوره و وکالت تخصصی در طلاق، مهریه، نفقه، حضانت و تمام دعاوی خانواده.",
    intro:
      "دعاوی خانواده از جمله مهم‌ترین پرونده‌های حقوقی هستند که به دلیل ارتباط مستقیم با زندگی شخصی، حقوق مالی و روابط میان اعضای خانواده، نیازمند بررسی دقیق و تخصصی هستند.",
    body:
      "موسسه حقوقی مجد وکیل الرعایا با ارائه خدمات تخصصی در حوزه حقوق خانواده، امکان دریافت مشاوره حقوقی خانواده و پیگیری انواع دعاوی خانواده — از جمله طلاق، مهریه، نفقه، حضانت، تمکین و اجرت‌المثل — را فراهم کرده است.",
    image: assets.businessDesk,
    icon: "heart",
    keywords: [
      "وکیل خانواده",
      "بهترین وکیل خانواده تهران",
      "مشاوره حقوقی خانواده",
      "دعاوی خانواده",
      "وکیل دعاوی خانواده",
    ],
    blogCategorySlugs: ["خانواده", "خانواه", "family"],
  },
  {
    prefix: "property-lawyer",
    title: "وکیل ملکی",
    menuLabel: "وکیل ملکی",
    excerpt:
      "خلع ید، سرقفلی، تخلیه، اسناد و قراردادهای ملکی در دادگاه‌های تخصصی املاک.",
    intro:
      "اختلاف ملکی اگر دیر شروع شود، تصرف و سند را پیچیده می‌کند. وکلای ملکی موسسه مجد از تنظیم قرارداد تا اجرای حکم تخلیه و خلع ید پرونده را با اولویت سرعت و دقت پیگیری می‌کنند.",
    body:
      "دعاوی تصرف، سرقفلی، افراز و اسناد ثبتی قواعد خاص خود را دارند. انتخاب عنوان صحیح دعوا — خلع ید، تصرف عدوانی یا تخلیه — مسیر دادگاه را عوض می‌کند. تیم ملکی مجد با تجربه در شرق تهران و محاکم تخصصی، قرارداد، ادله تصرف و اجرای ثبت را یکپارچه جلو می‌برد.",
    image: assets.realEstate,
    icon: "building",
    keywords: ["وکیل ملکی", "خلع ید", "سرقفلی", "تخلیه ملک"],
    blogCategorySlugs: ["ملکی", "املاک"],
  },
  {
    prefix: "criminal-defense-lawyer",
    title: "وکیل کیفری",
    menuLabel: "وکیل کیفری",
    excerpt:
      "دفاع تخصصی در قتل، مواد مخدر، کلاهبرداری، خیانت در امانت و جرایم اقتصادی.",
    intro:
      "در پرونده کیفری هر سکوت یا اقرار شتاب‌زده در بازجویی می‌تواند سرنوشت را عوض کند. حضور وکیل کیفری از نخستین ساعات، حق دفاع قانونی شما را حفظ می‌کند.",
    body:
      "وکلای کیفری موسسه مجد با تسلط بر قانون مجازات اسلامی، آیین دادرسی کیفری و رویه دادسرا و دادگاه کیفری یک و دو، دفاع مستند ارائه می‌دهند. از قرار تأمین تا تجدیدنظر و دیوان عالی، استراتژی پرونده بر اساس ادله و شخصیت اتهامی طراحی می‌شود.",
    image: assets.signingDocument,
    icon: "gavel",
    keywords: ["وکیل کیفری", "قتل", "مواد مخدر", "کلاهبرداری"],
    blogCategorySlugs: ["کیفری", "جزا"],
  },
  {
    prefix: "legal-consultation",
    title: "مشاوره حقوقی",
    menuLabel: "مشاوره حقوقی",
    excerpt:
      "مشاوره تخصصی حضوری و تلفنی پیش از هر اقدام قضایی؛ مسیر درست را قبل از طرح دعوا مشخص کنید.",
    intro:
      "بسیاری از پرونده‌ها با یک مشاوره دقیق در همان ابتدا مسیر کوتاه‌تری پیدا می‌کنند. موسسه مجد مشاوره حقوقی را با بررسی مدارک، ارزیابی ریسک و پیشنهاد مسیر — توافق، ثبت یا دادگاه — ارائه می‌دهد.",
    body:
      "مشاوره حقوقی موسسه برای اشخاص حقیقی و حقوقی، حضوری و تلفنی برگزار می‌شود. در جلسه اول، موضوع، مهلت‌های قانونی و مدارک لازم روشن می‌شود تا بدون هزینه اضافه وارد مسیر اشتباه نشوید. برای موارد خاص، امکان مشاوره اولیه رایگان نیز وجود دارد.",
    image: assets.businessSuit,
    icon: "chat",
    keywords: ["مشاوره حقوقی", "مشاوره وکیل", "مشاوره تلفنی"],
    blogCategorySlugs: ["مشاوره", "مشاوره-حقوقی"],
  },
  {
    prefix: "administrative-lawyer",
    title: "وکیل اداری",
    menuLabel: "وکیل اداری",
    excerpt:
      "اعتراض به تصمیمات دولتی، دیوان عدالت اداری، دعاوی قراردادی و اختلافات شرکت‌ها.",
    intro:
      "طرح شکایت در دیوان عدالت اداری و دعاوی اداری مهلت و تشریفات ویژه‌ای دارد. وکیل اداری موسسه مجد صلاحیت مرجع، مهلت اعتراض و نحوه تنظیم دادخواست را از ابتدا درست انتخاب می‌کند.",
    body:
      "علاوه بر دیوان عدالت اداری، اختلافات قراردادی و شرکتی نیز اغلب با دستگاه‌های عمومی یا مقررات اداری گره می‌خورند. تیم اداری و حقوقی مجد اعتراض به آراء هیئت‌ها، الزام دستگاه به انجام وظیفه و دعاوی شرکت‌ها را با لایحه مستدل و پیگیری اجرا پیش می‌برد.",
    image: assets.lawBooks,
    icon: "scale",
    keywords: [
      "وکیل اداری",
      "دیوان عدالت اداری",
      "اعتراض به رأی دولتی",
      "دعاوی شرکتی",
    ],
    blogCategorySlugs: ["اداری", "دیوان-عدالت", "حقوقی"],
  },
];

export function getPillar(
  prefix: ServiceCategoryPrefix,
): PillarDefinition | undefined {
  return PILLARS.find((item) => item.prefix === prefix);
}

/** Minimal landing used when WordPress has no editor content for this hub. */
export function landingFromPillar(pillar: PillarDefinition): PillarLanding {
  return {
    heroTitle: pillar.title,
    heroDescription: pillar.excerpt,
    seoTitle: pillar.title,
    seoDescription: pillar.excerpt,
    keywords: pillar.keywords,
    image: pillar.image,
    servicesHeading: `خدمات تخصصی ${pillar.title}`,
    servicesIntro: [pillar.intro],
    cardCopy: [],
    sections: [
      {
        heading: `چرا ${pillar.title}؟`,
        paragraphs: [pillar.body],
        variant: "navy",
      },
    ],
    faqsHeading: `سوالات متداول درباره ${pillar.title}`,
    faqs: [],
    cta: {
      heading: `همین حالا با ${pillar.title} مشورت کنید`,
      paragraphs: [
        `برای بررسی پرونده ${pillar.title} می‌توانید شرایط خود را با متخصصان موسسه حقوقی مجد وکیل الرعایا مطرح کنید.`,
      ],
      callTitle: `تماس با ${pillar.title}`,
      callDescription: `برای بررسی پرونده ${pillar.title} همین حالا تماس بگیرید.`,
      formTitle: `درخواست مشاوره ${pillar.title}`,
      formDescription: `موضوع پرونده ${pillar.title} را بنویسید؛ کارشناسان موسسه با شما تماس می‌گیرند.`,
    },
  };
}
