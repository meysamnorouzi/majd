import type { Service, TeamMember } from "@/types";

/** Local assets in /public/images */
export const assets = {
  logo: "/images/logo.png",
  founderPortrait: "/images/Masoud-Jokar-Darzi.jpg",
  webinarBanner: "/images/banner-webinar.jpg",
} as const;

export const siteConfig = {
  name: "موسسه حقوقی مجد وکیل الرعایا",
  shortName: "موسسه حقوقی مجد",
  tagline: "پیشگام در ارائه خدمات حقوقی تخصصی",
  description:
    "موسسه حقوقی مجد وکیل الرعایا با سال‌ها سابقه درخشان، ارائه‌دهنده خدمات حقوقی و مشاوره تخصصی در تهران. وکلای مجرب ما در صدها پرونده حقوقی و کیفری همراه شما هستند.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://vakilmajd.com",
  phones: ["۰۹۱۲۱۰۱۱۰۹۲", "۰۲۱۷۷۷۲۸۹۳۲", "۰۲۱۷۷۸۸۶۴۳۷"],
  phonesTel: ["+989121011092", "+982177728932", "+982177886437"],
  email: "info@vakilmajd.com",
  address: "تهران، خیابان ولیعصر، بالاتر از میدان ونک",
  workingHours: "شنبه تا چهارشنبه ۹ تا ۱۸ — پنجشنبه ۹ تا ۱۳",
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
    image:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",
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
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
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
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
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
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
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
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
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
    image:
      "https://images.unsplash.com/photo-1507679799987-c737795a7a8c?w=800&q=80",
  },
];

export const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "مسعود جوکار درزی",
    role: "مدیر موسسه — وکیل پایه یک دادگستری",
    specialty: "حقوق کیفری و بین‌الملل",
    bio: "بیش از دو دهه تجربه در پرونده‌های کیفری پیچیده و همکاری با سفارتخانه‌ها و اتاق‌های بازرگانی.",
    image: assets.founderPortrait,
  },
  {
    id: "2",
    name: "دکتر علی رضایی",
    role: "وکیل پایه یک",
    specialty: "حقوق تجارت و قراردادها",
    bio: "متخصص دعاوی تجاری، ورشکستگی و قراردادهای بین‌المللی.",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80",
  },
  {
    id: "3",
    name: "خانم سارا محمدی",
    role: "وکیل پایه یک",
    specialty: "حقوق خانواده",
    bio: "تخصص در دعاوی طلاق، حضانت و حقوق زنان.",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80",
  },
  {
    id: "4",
    name: "مهندس رضا کریمی",
    role: "وکیل پایه یک",
    specialty: "حقوق ملکی و ثبتی",
    bio: "پیگیری دعاوی ملکی، ثبت اسناد و اختلافات مشاع.",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&q=80",
  },
];

export const aboutContent = {
  title: "درباره موسسه حقوقی مجد",
  paragraphs: [
    "موسسه حقوقی مجد وکیل الرعایا یکی از معتبرترین مراکز ارائه خدمات حقوقی در تهران است که با بهره‌گیری از وکلای مجرب و متخصص، طیف گسترده‌ای از خدمات حقوقی را به اشخاص حقیقی و حقوقی ارائه می‌دهد.",
    "این موسسه موفق به دریافت برترین تندیس موسسه حقوقی کشور شده و در صدها پرونده حقوقی و کیفری فعالیت درخشانی داشته است. تیم ما در حوزه‌های حقوق خصوصی، جزا، خانواده، ملکی، تجارت بین‌الملل و حقوق بشر تخصص دارد.",
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
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
  },
  {
    id: 2,
    slug: "talagh-vakil",
    title: "وکیل طلاق توافقی و contentious در تهران",
    excerpt:
      "طلاق توافقی سریع‌ترین مسیر برای پایان زندگی مشترک است. وکیل خانواده موسسه مجد...",
    content: "",
    date: "2024-02-20",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
  },
  {
    id: 3,
    slug: "mosharekat-melki",
    title: "دعاوی اموال مشاع و تقسیم ملک",
    excerpt:
      "اختلافات مربوط به املاک مشاع از پرتکرارترین دعاوی ملکی است. راهکارهای قانونی...",
    content: "",
    date: "2024-03-10",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
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
    image:
      "https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&q=80",
  },
  {
    id: 2,
    slug: "form-gharardad",
    name: "بسته فرم‌های قراردادی استاندارد",
    short_description: "شامل ۵۰ فرم قرارداد تجاری و ملکی",
    description: "",
    price: "۲۸۰۰۰۰",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80",
  },
  {
    id: 3,
    slug: "moshavere-online",
    name: "جلسه مشاوره حقوقی آنلاین (۶۰ دقیقه)",
    short_description: "مشاوره تخصصی با وکیل پایه یک",
    description: "",
    price: "۸۵۰۰۰۰",
    image:
      "https://images.unsplash.com/photo-1507679799987-c737795a7a8c?w=600&q=80",
  },
];

export const navLinks = [
  { href: "/", label: "صفحه اصلی" },
  { href: "/services/", label: "خدمات" },
  { href: "/courses/", label: "دوره‌های آموزشی" },
  { href: "/team/", label: "اعضای تیم" },
  { href: "/blog/", label: "بلاگ" },
  { href: "/shop/", label: "فروشگاه" },
  { href: "/about/", label: "درباره ما" },
  { href: "/contact/", label: "تماس با ما" },
];
