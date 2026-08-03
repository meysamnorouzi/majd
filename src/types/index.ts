export interface WpMedia {
  source_url: string;
  alt_text: string;
}

export interface WpFeaturedMedia {
  source_url?: string;
  alt_text?: string;
}

export interface WpPost {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  date: string;
  featured_media: number;
  _embedded?: {
    "wp:featuredmedia"?: WpFeaturedMedia[];
  };
}

export interface WpPage {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt?: { rendered: string };
}

export interface WpProduct {
  id: number;
  slug: string;
  name: string;
  description: string;
  short_description: string;
  prices: {
    price: string;
    regular_price: string;
    sale_price: string;
    currency_symbol: string;
  };
  images: { src: string; alt: string }[];
  permalink: string;
}

export interface TeamMemberSocial {
  instagram?: string;
  telegram?: string;
  linkedin?: string;
}

export interface TeamMember {
  id: string;
  slug: string;
  name: string;
  role: string;
  specialty: string;
  bio: string;
  fullBio: string[];
  image: string;
  education: string;
  experienceYears: string;
  areasOfPractice: string[];
  achievements: string[];
  phone?: string;
  email?: string;
  location?: string;
  social?: TeamMemberSocial;
}

export interface ServiceFAQ {
  q: string;
  a: string;
}

export interface ServiceFeature {
  title: string;
  description: string;
}

export interface ServiceProcessStep {
  step: number;
  title: string;
  description: string;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  icon: string;
  image?: string;
  /** Nested nav / detail pages under this service */
  children?: Service[];
  /** Set when this item is a child of another service */
  parentSlug?: string;
  parentTitle?: string;
  longDescription?: string[];
  whyNeed?: { title: string; paragraphs: string[] };
  highlights?: string[];
  features?: ServiceFeature[];
  processSteps?: ServiceProcessStep[];
  cases?: string[];
  faqs?: ServiceFAQ[];
}

export type CourseFormatSlug =
  | "online-webinar"
  | "online-offline"
  | "hybrid-full"
  | "session-hybrid"
  | "session-inperson";

export interface CourseItem {
  id: string;
  slug: string;
  productSlug: string;
  title: string;
  duration: string;
  level: string;
  price?: string;
  description: string;
  syllabus: string[];
  highlights: string[];
  image?: string;
}

export interface StoreCartItem {
  key: string;
  id: number;
  quantity: number;
  name: string;
  short_description?: string;
  images: { src: string; alt?: string }[];
  prices: {
    price: string;
    regular_price: string;
    currency_symbol: string;
  };
  totals: {
    line_subtotal: string;
    line_total: string;
  };
}

export interface StoreCartTotals {
  total_items: string;
  total_items_tax: string;
  total_fees: string;
  total_fees_tax: string;
  total_discount: string;
  total_discount_tax: string;
  total_shipping: string;
  total_shipping_tax: string;
  total_price: string;
  total_tax: string;
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit: number;
  currency_decimal_separator: string;
  currency_thousand_separator: string;
  currency_prefix: string;
  currency_suffix: string;
}

export interface StoreCart {
  items: StoreCartItem[];
  items_count: number;
  totals: StoreCartTotals;
  coupons: unknown[];
  needs_payment: boolean;
  needs_shipping: boolean;
}

export interface BillingAddress {
  first_name: string;
  last_name: string;
  company?: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email: string;
  phone: string;
}

export interface CheckoutPayload {
  billing_address: BillingAddress;
  shipping_address?: BillingAddress;
  payment_method: string;
  customer_note?: string;
}

export interface CheckoutResponse {
  order_id: number;
  status: string;
  payment_result?: {
    payment_status: string;
    redirect_url?: string;
  };
}

export interface CourseFormat {
  slug: CourseFormatSlug;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  longDescription: string;
  features: string[];
  benefits: string[];
  courses: CourseItem[];
  image: string;
  accent: "gold" | "blue" | "emerald" | "violet" | "amber";
  ctaLabel: string;
}

export interface CustomerProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
}

export type LicenseStatus = "ready" | "license_pending" | "payment_pending";

export interface OrderLineItem {
  name: string;
  product_slug: string;
  quantity: number;
  spotplayer_license: string | null;
  license_status: LicenseStatus;
}

export interface CustomerOrder {
  id: number;
  status: string;
  date: string;
  total: string;
  currency: string;
  spotplayer_license: string | null;
  spotplayer_notes: string | null;
  license_status: LicenseStatus;
  items: OrderLineItem[];
}

export interface AuthResponse {
  token: string;
  user: CustomerProfile;
}

export interface PurchasedCourse {
  orderId: number;
  orderDate: string;
  orderStatus: string;
  licenseStatus: LicenseStatus;
  spotplayerLicense: string | null;
  spotplayerNotes: string | null;
  course: CourseItem | null;
  format: CourseFormat | null;
  productSlug: string;
  productName: string;
}
