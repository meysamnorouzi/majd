import type { Service, TeamMember } from "@/types";

/** Local assets in /public/images */
export const assets = {
  logo: "/images/logo.png",
  /** Primary portrait — standing by office window */
  founderPortrait: "/images/founder-standing-window.png",
  /** Wide cinematic banners (copy space) */
  founderBanner: "/images/founder-office-desk.png",
  founderBoardroom: "/images/founder-boardroom.png",
  founderArchitecture: "/images/founder-architecture.png",
  founderReading: "/images/founder-reading.png",
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
  teamMemberMale1: "/images/team-member-male-1.jpg",
  teamMemberFemale: "/images/team-member-female.jpg",
  teamMemberMale2: "/images/team-member-male-2.jpg",
  legalBooksClose: "/images/legal-books-close.jpg",
  onlineLearning: "/images/online-learning.jpg",
  classroom: "/images/classroom.jpg",
  studyDesk: "/images/study-desk.jpg",
} as const;

const founderGallery = [
  {
    src: assets.founderPortrait,
    alt: "مسعود جوکار درزی — ایستاده در دفتر وکالت",
  },
  {
    src: assets.founderBoardroom,
    alt: "مسعود جوکار درزی — جلسه مشاوره در اتاق کنفرانس",
  },
  {
    src: assets.founderArchitecture,
    alt: "مسعود جوکار درزی — پرتره حرفه‌ای",
  },
  {
    src: assets.founderReading,
    alt: "مسعود جوکار درزی — مطالعه پرونده حقوقی",
  },
  {
    src: assets.founderBanner,
    alt: "مسعود جوکار درزی — در دفتر کار",
  },
] as const;

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
  phones: ["۰۹۱۲۱۰۱۱۰۹۲", "۰۲۱۷۷۷۲۸۹۳۲", "۰۲۱۷۷۸۸۶۴۳۷"],
  phonesTel: ["+989121011092", "+982177728932", "+982177886437"],
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
        slug: "jarayem-eghtesadi",
        title: "جرایم اقتصادی",
        excerpt:
          "دفاع در پرونده‌های پول‌شویی، اخلال در نظام اقتصادی و جرایم مالی پیچیده.",
        description:
          "جرایم اقتصادی با پیچیدگی مستندات و تعدد اتهامات همراهند. تیم کیفری موسسه مجد با تجربه در این حوزه، دفاع تخصصی و مستند ارائه می‌دهد.",
        icon: "gavel",
        image: assets.financeMoney,
      },
      {
        id: "2-2",
        slug: "mavade-mokhadder",
        title: "مواد مخدر",
        excerpt:
          "دفاع در پرونده‌های نگهداری، حمل و قاچاق مواد مخدر در تمام مراحل.",
        description:
          "پرونده‌های مواد مخدر از حساس‌ترین دعاوی کیفری هستند. حضور وکیل از مراحل اولیه بازجویی تا صدور رأی نهایی نقش تعیین‌کننده‌ای در نتیجه پرونده دارد.",
        icon: "gavel",
        image: assets.signingDocument,
      },
      {
        id: "2-3",
        slug: "kolahbardari",
        title: "کلاهبرداری",
        excerpt:
          "پیگیری و دفاع در پرونده‌های کلاهبرداری، خیانت در امانت و انتقال مال غیر.",
        description:
          "چه شاکی باشید و چه متهم، وکلای موسسه مجد با تحلیل دقیق ادله و مستندات، مسیر قانونی مناسب را برای احقاق حق یا دفاع از شما دنبال می‌کنند.",
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
        title: "طلاق و مهریه",
        excerpt:
          "طلاق توافقی و یک‌طرفه، مطالبه و تقسیط مهریه با رویکرد حمایتی.",
        description:
          "از تنظیم دادخواست طلاق تا پیگیری مهریه و حقوق مالی زوجین، تیم خانواده موسسه مجد با درک حساسیت موضوع، مسیر حقوقی را شفاف و حرفه‌ای پیش می‌برد.",
        icon: "heart",
        image: assets.businessDesk,
      },
      {
        id: "3-2",
        slug: "hezanat-farzand",
        title: "حضانت فرزند",
        excerpt:
          "تعیین و سلب حضانت، ملاقات فرزند و حفظ منافع کودک.",
        description:
          "در دعاوی حضانت، اولویت با مصلحت کودک است. وکلای ما با تسلط بر قوانین خانواده، از حقوق والدین و فرزندان در دادگاه دفاع می‌کنند.",
        icon: "heart",
        image: assets.businessDesk,
      },
      {
        id: "3-3",
        slug: "nafaghe",
        title: "نفقه",
        excerpt:
          "مطالبه نفقه زوجه و اولاد، ترک انفاق و اجرای احکام نفقه.",
        description:
          "نفقه از حقوق قانونی زوجه و فرزندان است. موسسه مجد در مطالبه، پیگیری و اجرای احکام نفقه با سرعت و دقت اقدام می‌کند.",
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
        slug: "malek-mostajer",
        title: "مالک و مستأجر",
        excerpt:
          "تخلیه عین مستأجره، مطالبه اجاره‌بها و اختلافات قرارداد اجاره.",
        description:
          "روابط استیجاری قواعد خاص خود را دارد. وکلای ملکی موسسه مجد در تخلیه، تعدیل اجاره و حل اختلافات مالک و مستأجر تخصص دارند.",
        icon: "building",
        image: assets.realEstate,
      },
      {
        id: "4-2",
        slug: "davaye-sabti",
        title: "دعاوی ثبتی",
        excerpt:
          "اعتراض به ثبت، افراز، تفکیک و پیگیری امور ثبت اسناد و املاک.",
        description:
          "دعاوی ثبتی نیازمند آشنایی با قانون ثبت و رویه ادارات ثبت است. تیم ملکی موسسه مجد پرونده‌های ثبتی را از ابتدا تا صدور سند پیگیری می‌کند.",
        icon: "building",
        image: assets.realEstate,
      },
      {
        id: "4-3",
        slug: "khale-yad",
        title: "خلع ید و تصرف",
        excerpt:
          "خلع ید، تصرف عدوانی، ممانعت از حق و رفع مزاحمت ملکی.",
        description:
          "در دعاوی تصرف و خلع ید، سرعت اقدام و تنظیم صحیح دادخواست اهمیت ویژه‌ای دارد. وکلای موسسه مجد این پرونده‌ها را با اولویت و دقت پیگیری می‌کنند.",
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

/** Full roster — kept for later; public UI uses `teamMembers` only */
const allTeamMembers: TeamMember[] = [
  {
    id: "1",
    slug: "masoud-jokar-darzi",
    name: "مسعود جوکار درزی",
    role: "مدیر موسسه — وکیل پایه یک دادگستری",
    specialty: "حقوق کیفری و بین‌الملل",
    bio: "بیش از دو دهه تجربه در پرونده‌های کیفری پیچیده و همکاری با سفارتخانه‌ها و اتاق‌های بازرگانی.",
    fullBio: [
      "مسعود جوکار درزی، وکیل پایه یک دادگستری و بنیان‌گذار موسسه حقوقی مجد وکیل الرعایا، بیش از دو دهه در خط مقدم دفاع از حقوق موکلان در پرونده‌های حقوقی و کیفری ایستاده است.",
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
  {
    id: "2",
    slug: "ali-rezaei",
    name: "دکتر علی رضایی",
    role: "وکیل پایه یک",
    specialty: "حقوق تجارت و قراردادها",
    bio: "متخصص دعاوی تجاری، ورشکستگی و قراردادهای بین‌المللی.",
    fullBio: [
      "دکتر علی رضایی با تخصص در حقوق تجارت و قراردادها، یکی از ارکان اصلی تیم حقوقی موسسه مجد است. ایشان در تنظیم، بازبینی و دفاع از قراردادهای تجاری پیچیده تجربه گسترده‌ای دارند.",
      "حوزه فعالیت ایشان شامل دعاوی تجاری، ورشکستگی، اختلافات سهامداران و قراردادهای بین‌المللی است. رویکرد ایشان ترکیبی از دقت حقوقی و درک عمیق از نیازهای کسب‌وکار است.",
    ],
    image: assets.teamMemberMale1,
    education: "دکترای حقوق خصوصی — دانشگاه تهران",
    experienceYears: "۱۵+",
    areasOfPractice: [
      "قراردادهای تجاری",
      "ورشکستگی",
      "دعاوی شرکت‌ها",
      "حقوق بازرگانی بین‌الملل",
      "داوری تجاری",
    ],
    achievements: [
      "مشاور حقوقی شرکت‌های بزرگ داخلی و بین‌المللی",
      "تنظیم بیش از ۵۰۰ قرارداد تجاری",
      "پیروزی در دعاوی تجاری با ارزش میلیاردی",
      "عضو هیئت داوری اتاق بازرگانی",
    ],
    phone: siteConfig.phones[1],
    email: siteConfig.email,
    location: siteConfig.address,
  },
  {
    id: "3",
    slug: "sara-mohammadi",
    name: "خانم سارا محمدی",
    role: "وکیل پایه یک",
    specialty: "حقوق خانواده",
    bio: "تخصص در دعاوی طلاق، حضانت و حقوق زنان.",
    fullBio: [
      "خانم سارا محمدی، وکیل پایه یک دادگستری، متخصص حقوق خانواده و دعاوی مرتبط با ازدواج، طلاق و حضانت فرزندان است. ایشان با رویکردی همدلانه و حرفه‌ای، در یکی از حساس‌ترین حوزه‌های حقوقی همراه موکلان است.",
      "تجربه ایشان در پرونده‌های طلاق توافقی و غیرتوافقی، تعیین نفقه، مهریه و حضانت، به همراه آشنایی با رویه قضایی دیوان عالی، از نقاط قوت تخصصی ایشان محسوب می‌شود.",
    ],
    image: assets.teamMemberFemale,
    education: "کارشناسی ارشد حقوق خانواده",
    experienceYears: "۱۲+",
    areasOfPractice: [
      "طلاق و جدایی",
      "حضانت و نفقه فرزند",
      "مهریه و جهیزیه",
      "حقوق زنان",
      "صلح و سازش خانوادگی",
    ],
    achievements: [
      "تسهیل صلح و سازش در بیش از ۲۰۰ پرونده خانوادگی",
      "سخنران در همایش‌های حقوق خانواده",
      "مشاور حقوقی مراکز مشاوره خانواده",
      "نویسنده مقالات تخصصی حقوق زنان",
    ],
    phone: siteConfig.phones[2],
    email: siteConfig.email,
    location: siteConfig.address,
  },
  {
    id: "4",
    slug: "reza-karimi",
    name: "مهندس رضا کریمی",
    role: "وکیل پایه یک",
    specialty: "حقوق ملکی و ثبتی",
    bio: "پیگیری دعاوی ملکی، ثبت اسناد و اختلافات مشاع.",
    fullBio: [
      "مهندس رضا کریمی با ترکیب دانش حقوقی و فنی مهندسی، در حوزه حقوق ملکی و ثبتی یکی از متخصصان برجسته موسسه مجد است. ایشان در پرونده‌های پیچیده املاک، ثبت اسناد و اختلافات مشاع سابقه درخشانی دارند.",
      "توانایی ایشان در تحلیل نقشه‌ها، اسناد ثبتی و قراردادهای ملکی، همراه با تجربه دادرسی، موجب شده تا در پرونده‌های ملکی با ابعاد فنی-حقوقی به نتایج مطلوبی دست یابند.",
    ],
    image: assets.teamMemberMale2,
    education: "کارشناسی مهندسی عمران — کارشناسی ارشد حقوق خصوصی",
    experienceYears: "۱۴+",
    areasOfPractice: [
      "دعاوی ملکی",
      "ثبت اسناد و املاک",
      "اختلافات مشاع",
      "قراردادهای خرید و فروش",
      "خلع ید و تصرف عدوانی",
    ],
    achievements: [
      "پیگیری موفق پرونده‌های ملکی با ارزش میلیارد تومان",
      "مشاور حقوقی پروژه‌های ساختمانی",
      "تخصص در پرونده‌های ثبتی پیچیده",
      "همکاری با کارشناسان رسمی دادگستری",
    ],
    phone: siteConfig.phones[0],
    email: siteConfig.email,
    location: siteConfig.address,
  },
];

/** Temporarily show only the founder; restore full `allTeamMembers` when ready */
export const teamMembers: TeamMember[] = allTeamMembers.filter(
  (m) => m.slug === "masoud-jokar-darzi",
);

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
  { href: "/blog/", label: "مقالات" },
  // Temporarily hidden — no payment gateway yet
  // { href: "/shop/", label: "فروشگاه" },
  { href: "/about/", label: "درباره ما" },
  { href: "/contact/", label: "تماس با ما" },
];
