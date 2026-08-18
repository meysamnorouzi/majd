import type { Service, TeamMember } from "@/types";

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
  /** Legacy still used as fallback / secondary */
  founderPortraitLegacy: "/images/Masoud-Jokar-Darzi.jpg",
  webinarBanner: "/images/banner-webinar.jpg",
  awardBadge: "/images/award-1401.png",
  lawBooks: "/images/law-books.jpg",
  signingDocument: "/images/signing-document.jpg",
  businessDesk: "/images/business-desk.jpg",
  realEstate: "/images/real-estate.jpg",
  financeMoney: "/images/finance-money.jpg",
  businessSuit: "/images/business-suit.jpg",
  legalBooksClose: "/images/legal-books-close.jpg",
  onlineLearning: "/images/online-learning.jpg",
  classroom: "/images/classroom.jpg",
  studyDesk: "/images/study-desk.jpg",
} as const;

const founderGallery = [
  {
    src: assets.founderBanner,
    alt: "مسعود جوکار درزی — سخنرانی در همایش",
  },
  {
    src: assets.founderPressPortrait,
    alt: "مسعود جوکار درزی — گفتگوی رسانه‌ای",
  },
  {
    src: assets.founderBoardroom,
    alt: "مسعود جوکار درزی — گفتگو با رسانه‌ها",
  },
  {
    src: assets.founderAward,
    alt: "مسعود جوکار درزی — جایزه و لوح تقدیر",
  },
  {
    src: assets.founderReading,
    alt: "مسعود جوکار درزی — پشت تریبون",
  },
  {
    src: assets.founderConversation,
    alt: "مسعود جوکار درزی — گفتگو در همایش",
  },
  {
    src: assets.founderSeated,
    alt: "مسعود جوکار درزی — حضور در نشست تخصصی",
  },
  {
    src: assets.founderNetworking,
    alt: "مسعود جوکار درزی — دیدار رسمی",
  },
] as const;

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
  workingHours: "شنبه تا چهارشنبه ۹ تا ۱۸ — پنجشنبه ۹ تا ۱۳",
  contactCta: "برای دریافت مشاوره هم‌اکنون تماس بگیرید",
  award: {
    year: "۱۴۰۱",
    title: "برترین موسسه حقوقی تهران",
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
  { value: "۱", label: "تندیس برتر موسسه حقوقی" },
];

export const practiceAreas = [
  "حقوق خصوصی و عمومی",
  "حقوق اقتصادی و تجارت بین‌الملل",
  "حقوق جزا و جرم‌شناسی",
  "حقوق بشر و محیط زیست",
  "حقوق بین‌الملل",
];

export const services: Service[] = [
  {
    id: "1",
    slug: "vakalat-hoghooghi",
    title: "وکالت در دعاوی حقوقی",
    excerpt:
      "پیگیری تخصصی دعاوی مدنی، قراردادها، مطالبات و اختلافات تجاری با استراتژی دفاعی هدفمند.",
    description:
      "تیم حقوقی موسسه مجد در تمامی مراحل دادرسی — از دادسرا تا دیوان عالی — همراه موکلین است. تمرکز ما بر تحلیل دقیق مستندات، تنظیم لوایح مستدل و دستیابی به بهترین نتیجه ممکن است.",
    icon: "scale",
    image: assets.lawBooks,
    children: [
      {
        id: "1-1",
        slug: "davaye-gharardadi",
        title: "دعاوی قراردادی",
        excerpt:
          "اختلافات ناشی از قراردادهای خرید، فروش، پیمانکاری، مشارکت و تعهدات قراردادی.",
        description:
          "از تفسیر مفاد قرارداد تا مطالبه خسارت و فسخ، وکلای موسسه مجد با تحلیل دقیق تعهدات طرفین، بهترین مسیر حقوقی را برای احقاق حق شما طراحی می‌کنند.",
        icon: "scale",
        image: assets.lawBooks,
      },
      {
        id: "1-2",
        slug: "davaye-sherkatha",
        title: "دعاوی شرکت‌ها",
        excerpt:
          "اختلافات سهامداران، هیئت‌مدیره، انحلال و مسئولیت مدیران شرکت.",
        description:
          "پرونده‌های شرکتی نیازمند تسلط بر قانون تجارت و اساسنامه است. تیم ما در اختلافات داخلی شرکت، عزل مدیران و دعاوی بین شرکا همراه شماست.",
        icon: "scale",
        image: assets.businessDesk,
      },
      {
        id: "1-3",
        slug: "divan-edalat",
        title: "دیوان عدالت اداری",
        excerpt:
          "اعتراض به آراء و تصمیمات اداری، دولتی و نهادهای عمومی.",
        description:
          "طرح دعوا در دیوان عدالت اداری قواعد خاص خود را دارد. وکلای موسسه مجد در اعتراض به تصمیمات اداری و احقاق حقوق در برابر دستگاه‌های دولتی تخصص دارند.",
        icon: "scale",
        image: assets.lawBooks,
      },
    ],
  },
  {
    id: "2",
    slug: "vakalat-keyfari",
    title: "وکالت در دعاوی کیفری",
    excerpt:
      "دفاع تخصصی در پرونده‌های جزایی شامل قتل، مواد مخدر، کلاهبرداری و جرایم اقتصادی.",
    description:
      "وکلای کیفری موسسه با تسلط بر قانون مجازات اسلامی و رویه قضایی، دفاع علمی و مستند ارائه می‌دهند و در اخذ تخفیف و تسریع روند پرونده تخصص دارند.",
    icon: "gavel",
    image: assets.signingDocument,
    children: [
      {
        id: "2-1",
        slug: "kolahbardari",
        title: "وکیل کلاهبرداری",
        excerpt:
          "پیگیری و دفاع در پرونده‌های کلاهبرداری و انتقال مال غیر.",
        description:
          "چه شاکی باشید و چه متهم، وکلای موسسه مجد با تحلیل دقیق ادله و مستندات، مسیر قانونی مناسب را برای احقاق حق یا دفاع از شما دنبال می‌کنند.",
        icon: "gavel",
        image: assets.signingDocument,
      },
      {
        id: "2-2",
        slug: "khianat-amanat",
        title: "وکیل خیانت در امانت",
        excerpt:
          "دفاع و پیگیری پرونده‌های خیانت در امانت و سوءاستفاده از اموال سپرده‌شده.",
        description:
          "پرونده‌های خیانت در امانت نیازمند اثبات یا رد رکن سپردن مال و سوءنیت است. تیم کیفری موسسه مجد این دعاوی را با دقت مستند پیش می‌برد.",
        icon: "gavel",
        image: assets.signingDocument,
      },
      {
        id: "2-3",
        slug: "dieh",
        title: "وکیل دیه",
        excerpt:
          "مطالبه و دفاع در پرونده‌های دیه، ارش و خسارات بدنی.",
        description:
          "از تعیین میزان دیه تا پیگیری بیمه‌ای و اجرای حکم، وکلای کیفری موسسه مجد در پرونده‌های دیه همراه شما هستند.",
        icon: "gavel",
        image: assets.signingDocument,
      },
      {
        id: "2-4",
        slug: "jenayi-ghatl",
        title: "وکیل جنایی و قتل",
        excerpt:
          "دفاع تخصصی در پرونده‌های قتل، ضرب‌وجرح منجر به فوت و جنایات علیه اشخاص.",
        description:
          "پرونده‌های جنایی حساس‌ترین دعاوی کیفری هستند. حضور وکیل مجرب از بازجویی تا دیوان عالی نقش تعیین‌کننده‌ای در نتیجه دارد.",
        icon: "gavel",
        image: assets.signingDocument,
      },
      {
        id: "2-5",
        slug: "mavade-mokhadder",
        title: "وکیل مواد مخدر و شرب خمر",
        excerpt:
          "دفاع در پرونده‌های نگهداری، حمل، قاچاق مواد مخدر و شرب خمر.",
        description:
          "پرونده‌های مواد مخدر از حساس‌ترین دعاوی کیفری هستند. حضور وکیل از مراحل اولیه بازجویی تا صدور رأی نهایی نقش تعیین‌کننده‌ای در نتیجه پرونده دارد.",
        icon: "gavel",
        image: assets.signingDocument,
      },
      {
        id: "2-6",
        slug: "jarayem-rayane",
        title: "وکیل جرایم رایانه‌ای",
        excerpt:
          "پیگیری جرایم سایبری، کلاهبرداری اینترنتی و دسترسی غیرمجاز.",
        description:
          "جرایم رایانه‌ای قواعد اثبات و ادله خاص خود را دارند. تیم موسسه مجد در این حوزه دفاع و پیگیری تخصصی ارائه می‌دهد.",
        icon: "gavel",
        image: assets.signingDocument,
      },
      {
        id: "2-7",
        slug: "jarayem-eghtesadi",
        title: "وکیل اقتصادی",
        excerpt:
          "دفاع در پرونده‌های پول‌شویی، اخلال اقتصادی و جرایم مالی پیچیده.",
        description:
          "جرایم اقتصادی با پیچیدگی مستندات و تعدد اتهامات همراهند. تیم کیفری موسسه مجد با تجربه در این حوزه، دفاع تخصصی و مستند ارائه می‌دهد.",
        icon: "gavel",
        image: assets.financeMoney,
      },
      {
        id: "2-8",
        slug: "jaal",
        title: "وکیل جعل",
        excerpt:
          "دفاع و پیگیری پرونده‌های جعل اسناد، جعل امضا و استفاده از سند مجعول.",
        description:
          "اثبات یا رد جعل نیازمند کارشناسی دقیق است. وکلای موسسه مجد پرونده‌های جعل را با بهره‌گیری از ادله تخصصی پیگیری می‌کنند.",
        icon: "gavel",
        image: assets.signingDocument,
      },
      {
        id: "2-9",
        slug: "serghat",
        title: "وکیل سرقت",
        excerpt:
          "دفاع در اتهامات سرقت ساده، مقرون به آزار و سرقت مسلحانه.",
        description:
          "در پرونده‌های سرقت، تفکیک عناوین اتهامی و دفاع مستند از آزادی موکل اهمیت ویژه‌ای دارد.",
        icon: "gavel",
        image: assets.signingDocument,
      },
      {
        id: "2-10",
        slug: "rabete-nameshroo",
        title: "وکیل رابطه نامشروع و خیانت",
        excerpt:
          "پیگیری و دفاع در پرونده‌های رابطه نامشروع و اتهامات مرتبط.",
        description:
          "این پرونده‌ها حساسیت بالا و آثار خانوادگی دارند. موسسه مجد با حفظ حریم خصوصی موکل، دفاع حقوقی دقیق ارائه می‌دهد.",
        icon: "gavel",
        image: assets.signingDocument,
      },
    ],
  },
  {
    id: "3",
    slug: "vakalat-khanavade",
    title: "وکالت خانواده",
    excerpt:
      "طلاق، حضانت فرزند، مهریه، نفقه و حقوق زنان با رویکردی انسانی و حقوقی.",
    description:
      "پرونده‌های خانواده نیازمند حساسیت و تخصص همزمان است. موسسه مجد در تمامی دعاوی خانواده از مشاوره اولیه تا اجرای احکام در کنار شماست.",
    icon: "heart",
    image: assets.businessDesk,
    children: [
      {
        id: "3-1",
        slug: "talagh-mehrieh",
        title: "وکیل طلاق",
        excerpt:
          "طلاق توافقی و یک‌طرفه با رویکرد حمایتی و شفاف.",
        description:
          "از تنظیم دادخواست تا صدور حکم طلاق، تیم خانواده موسسه مجد مسیر حقوقی را حرفه‌ای و با کمترین تنش پیش می‌برد.",
        icon: "heart",
        image: assets.businessDesk,
      },
      {
        id: "3-2",
        slug: "mehrieh",
        title: "وکیل مهریه",
        excerpt:
          "مطالبه، تقسیط و دفاع در پرونده‌های مهریه.",
        description:
          "پیگیری مهریه از طریق اجرای ثبت یا دادگاه نیازمند استراتژی دقیق است. وکلای موسسه مجد این مسیر را شفاف مدیریت می‌کنند.",
        icon: "heart",
        image: assets.businessDesk,
      },
      {
        id: "3-3",
        slug: "nafaghe",
        title: "وکیل نفقه",
        excerpt:
          "مطالبه نفقه زوجه و اولاد، ترک انفاق و اجرای احکام نفقه.",
        description:
          "نفقه از حقوق قانونی زوجه و فرزندان است. موسسه مجد در مطالبه، پیگیری و اجرای احکام نفقه با سرعت و دقت اقدام می‌کند.",
        icon: "heart",
        image: assets.businessDesk,
      },
      {
        id: "3-4",
        slug: "hezanat-farzand",
        title: "وکیل حضانت",
        excerpt:
          "تعیین و سلب حضانت، ملاقات فرزند و حفظ منافع کودک.",
        description:
          "در دعاوی حضانت، اولویت با مصلحت کودک است. وکلای ما با تسلط بر قوانین خانواده، از حقوق والدین و فرزندان در دادگاه دفاع می‌کنند.",
        icon: "heart",
        image: assets.businessDesk,
      },
      {
        id: "3-5",
        slug: "tamkin",
        title: "وکیل تمکین",
        excerpt:
          "دعوای الزام به تمکین و دفاع در برابر آن.",
        description:
          "پرونده‌های تمکین آثار مهمی بر نفقه و حقوق زوجین دارند. موسسه مجد در این دعاوی مشاوره و وکالت تخصصی ارائه می‌دهد.",
        icon: "heart",
        image: assets.businessDesk,
      },
      {
        id: "3-6",
        slug: "nahleh",
        title: "وکیل نحله",
        excerpt:
          "مطالبه نحله و حقوق مالی ناشی از طلاق.",
        description:
          "نحله یکی از حقوق مالی زوجه در شرایط خاص طلاق است. تیم خانواده موسسه مجد امکان مطالبه آن را بررسی و پیگیری می‌کند.",
        icon: "heart",
        image: assets.businessDesk,
      },
    ],
  },
  {
    id: "4",
    slug: "vakalat-melki",
    title: "وکالت ملکی",
    excerpt:
      "اختلافات مالک و مستأجر، اموال مشاع، تنظیم قرارداد و پیگیری دعاوی ثبتی.",
    description:
      "از تنظیم قراردادهای اجاره و بیع تا دعاوی تصرف عدوانی و خلع ید، تیم ملکی موسسه مجد تجربه گسترده‌ای در دادگاه‌های تخصصی دارد.",
    icon: "building",
    image: assets.realEstate,
    children: [
      {
        id: "4-1",
        slug: "khale-yad",
        title: "وکیل خلع ید و تصرف عدوانی",
        excerpt:
          "خلع ید، تصرف عدوانی، ممانعت از حق و رفع مزاحمت ملکی.",
        description:
          "در دعاوی تصرف و خلع ید، سرعت اقدام و تنظیم صحیح دادخواست اهمیت ویژه‌ای دارد. وکلای موسسه مجد این پرونده‌ها را با اولویت و دقت پیگیری می‌کنند.",
        icon: "building",
        image: assets.realEstate,
      },
      {
        id: "4-2",
        slug: "malek-mostajer",
        title: "وکیل تخلیه و سرقفلی",
        excerpt:
          "تخلیه عین مستأجره، سرقفلی و حقوق کسب و پیشه.",
        description:
          "روابط استیجاری و سرقفلی قواعد خاص خود را دارد. وکلای ملکی موسسه مجد در تخلیه و دعاوی سرقفلی تخصص دارند.",
        icon: "building",
        image: assets.realEstate,
      },
      {
        id: "4-3",
        slug: "asnad-gharardad-melki",
        title: "وکیل اسناد و قرارداد ملکی",
        excerpt:
          "تنظیم، بررسی و پیگیری اختلافات قراردادهای ملکی.",
        description:
          "قراردادهای بیع، اجاره و پیش‌فروش نیازمند دقت حقوقی‌اند. تیم ملکی موسسه مجد از تنظیم تا اجرای قرارداد همراه شماست.",
        icon: "building",
        image: assets.realEstate,
      },
      {
        id: "4-4",
        slug: "afraz",
        title: "وکیل افراز",
        excerpt:
          "افراز، تفکیک و تقسیم اموال مشاع.",
        description:
          "دعاوی افراز نیازمند آشنایی با قانون ثبت و رویه محاکم است. موسسه مجد این پرونده‌ها را تا صدور سند پیگیری می‌کند.",
        icon: "building",
        image: assets.realEstate,
      },
      {
        id: "4-5",
        slug: "davaye-keyfari-melki",
        title: "وکیل دعاوی کیفری ملکی",
        excerpt:
          "پیگیری جنبه‌های کیفری اختلافات ملکی مانند فروش مال غیر.",
        description:
          "برخی اختلافات ملکی بعد کیفری نیز دارند. تیم موسسه مجد مسیر حقوقی و کیفری را هماهنگ پیش می‌برد.",
        icon: "building",
        image: assets.realEstate,
      },
      {
        id: "4-6",
        slug: "shahrdari",
        title: "وکیل شهرداری",
        excerpt:
          "اعتراض به آرای کمیسیون‌ها و دعاوی مرتبط با شهرداری.",
        description:
          "پرونده‌های شهرداری قواعد اداری خاص دارند. وکلای موسسه مجد در کمیسیون‌ها و مراجع صالح از حقوق موکل دفاع می‌کنند.",
        icon: "building",
        image: assets.realEstate,
      },
      {
        id: "4-7",
        slug: "pishforosh-mosharekat",
        title: "وکیل پیش فروش و مشارکت در ساخت",
        excerpt:
          "اختلافات پیش‌فروش، مشارکت در ساخت و تعهدات سازنده.",
        description:
          "قراردادهای پیش‌فروش و مشارکت ریسک‌های حقوقی بالایی دارند. تیم ملکی موسسه مجد در تنظیم و حل اختلاف این قراردادها تخصص دارد.",
        icon: "building",
        image: assets.realEstate,
      },
      {
        id: "4-8",
        slug: "davaye-sabti",
        title: "وکیل ثبت اسناد",
        excerpt:
          "اعتراض به ثبت، صدور سند و پیگیری امور ثبت اسناد و املاک.",
        description:
          "دعاوی ثبتی نیازمند آشنایی با قانون ثبت و رویه ادارات ثبت است. تیم ملکی موسسه مجد پرونده‌های ثبتی را از ابتدا تا صدور سند پیگیری می‌کند.",
        icon: "building",
        image: assets.realEstate,
      },
    ],
  },
  {
    id: "5",
    slug: "vosool-matalabat",
    title: "وصول مطالبات",
    excerpt:
      "پیگیری مطالبات مالی، چک برگشتی، سفته و اجرای احکام مالی.",
    description:
      "با بهره‌گیری از مسیرهای قانونی وصول مطالبات و اجرای احکام، حقوق مالی موکلین را در کوتاه‌ترین زمان ممکن پیگیری می‌کنیم.",
    icon: "coins",
    image: assets.financeMoney,
    children: [
      {
        id: "5-1",
        slug: "check-bargashti",
        title: "چک برگشتی",
        excerpt:
          "پیگیری کیفری و حقوقی چک بلامحل و وصول وجه چک.",
        description:
          "از ثبت شکایت کیفری تا اجرای ثبت و وصول وجه چک، مسیر قانونی چک برگشتی را گام‌به‌گام و با سرعت برای شما طی می‌کنیم.",
        icon: "coins",
        image: assets.financeMoney,
      },
      {
        id: "5-2",
        slug: "ejraye-ahkam",
        title: "اجرای احکام مالی",
        excerpt:
          "اجرای احکام قطعی، توقیف اموال و وصول محکوم‌به.",
        description:
          "صدور حکم پایان کار نیست؛ اجرای آن اهمیت دارد. واحد وصول مطالبات موسسه مجد احکام مالی را تا وصول کامل پیگیری می‌کند.",
        icon: "coins",
        image: assets.financeMoney,
      },
    ],
  },
  {
    id: "6",
    slug: "moshavere-hoghooghi",
    title: "مشاوره حقوقی",
    excerpt:
      "مشاوره تخصصی حضوری و تلفنی؛ مشاوره رایگان برای اشخاص نیازمند.",
    description:
      "قبل از هر اقدام حقوقی، مشاوره دقیق می‌تواند مسیر پرونده را تغییر دهد. اولین جلسه مشاوره برای پرونده‌های خاص رایگان ارائه می‌شود.",
    icon: "chat",
    image: assets.businessSuit,
  },
];

/** Minimal fallback when WordPress team API is unavailable — founder only */
export const fallbackTeamMembers: TeamMember[] = [
  {
    id: "1",
    slug: "masoud-jokar-darzi",
    name: "مسعود جوکار درزی",
    role: "مدیر عامل موسسه حقوقی مجد",
    specialty: "حقوق کیفری و بین‌الملل",
    bio: "بیش از دو دهه تجربه در پرونده‌های کیفری پیچیده و همکاری با سفارتخانه‌ها و اتاق‌های بازرگانی.",
    fullBio: [
      "مسعود جوکار درزی، بنیان‌گذار موسسه حقوقی مجد وکیل الرعایا، بیش از دو دهه در خط مقدم دفاع از حقوق موکلان در پرونده‌های حقوقی و کیفری ایستاده است.",
      "ایشان در پرونده‌های کیفری پیچیده، جرایم اقتصادی و پرونده‌های دارای ابعاد بین‌المللی سابقه درخشانی دارند و با سفارتخانه‌ها و اتاق‌های بازرگانی کشورهای اروپایی همکاری نزدیکی داشته‌اند.",
      "رویکرد حرفه‌ای ایشان بر پایه مشاوره صادقانه، برنامه‌ریزی دقیق دفاعی و همراهی مستمر موکل در تمامی مراحل دادرسی استوار است.",
    ],
    image: assets.founderPortrait,
    bannerImage: assets.founderBanner,
    gallery: [...founderGallery],
    education: "کارشناسی ارشد حقوق جزا و جرم‌شناسی",
    experienceYears: "۲۰+",
    areasOfPractice: [
      "دفاع کیفری",
      "جرایم اقتصادی",
      "حقوق بین‌الملل",
      "مشاوره حقوقی",
      "وکالت در دیوان عالی کشور",
    ],
    achievements: [
      "دریافت برترین تندیس موسسه حقوقی کشور",
      "همکاری با سفارتخانه‌های سوئد، دانمارک و اسپانیا",
      "دفاع موفق در صدها پرونده کیفری و حقوقی",
      "مدرس دوره‌های تخصصی وکالت کیفری",
    ],
    phone: siteConfig.phones[0],
    email: siteConfig.email,
    location: siteConfig.address,
    social: {
      instagram: siteConfig.social.instagram,
      telegram: siteConfig.social.telegram,
      linkedin: siteConfig.social.linkedin,
    },
  },
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

export const fallbackPosts = [
  {
    id: 1,
    slug: "vakil-ghalat",
    title: "وکیل قتل: نقش وکیل متخصص در پرونده‌های کیفری",
    excerpt:
      "قتل از جدی‌ترین جرایم علیه تمامیت جسمانی است. نقش وکیل متخصص در دفاع علمی و اخذ تخفیف...",
    content: "",
    date: "2024-01-15",
    image: assets.signingDocument,
  },
  {
    id: 2,
    slug: "talagh-vakil",
    title: "وکیل طلاق توافقی و contentious در تهران",
    excerpt:
      "طلاق توافقی سریع‌ترین مسیر برای پایان زندگی مشترک است. وکیل خانواده موسسه مجد...",
    content: "",
    date: "2024-02-20",
    image: assets.businessDesk,
  },
  {
    id: 3,
    slug: "mosharekat-melki",
    title: "دعاوی اموال مشاع و تقسیم ملک",
    excerpt:
      "اختلافات مربوط به املاک مشاع از پرتکرارترین دعاوی ملکی است. راهکارهای قانونی...",
    content: "",
    date: "2024-03-10",
    image: assets.realEstate,
  },
];

export const fallbackProducts = [
  {
    id: 1,
    slug: "ketab-hoghooghi",
    name: "مجموعه قوانین مدنی و آیین دادرسی",
    short_description: "چاپ جدید ۱۴۰۳ — منبع کامل برای وکلا و دانشجویان",
    description: "",
    price: "۴۵۰۰۰۰",
    image: assets.legalBooksClose,
  },
  {
    id: 2,
    slug: "form-gharardad",
    name: "بسته فرم‌های قراردادی استاندارد",
    short_description: "شامل ۵۰ فرم قرارداد تجاری و ملکی",
    description: "",
    price: "۲۸۰۰۰۰",
    image: assets.signingDocument,
  },
  {
    id: 3,
    slug: "moshavere-online",
    name: "جلسه مشاوره حقوقی آنلاین (۶۰ دقیقه)",
    short_description: "مشاوره تخصصی با وکیل پایه یک",
    description: "",
    price: "۸۵۰۰۰۰",
    image: assets.businessSuit,
  },
];

export const navLinks = [
  { href: "/", label: "صفحه اصلی" },
  { href: "/services/", label: "خدمات" },
  // Temporarily hidden — no payment gateway yet
  // { href: "/courses/", label: "دوره‌های آموزشی" },
  { href: "/team/", label: "اعضای تیم" },
  { href: "/blogs/", label: "مقالات" },
  // Temporarily hidden — no payment gateway yet
  // { href: "/shop/", label: "فروشگاه" },
  { href: "/about/", label: "درباره ما" },
  { href: "/contact/", label: "تماس با ما" },
];
