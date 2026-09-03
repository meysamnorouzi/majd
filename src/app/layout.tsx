import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { DeferredGoftino } from "@/components/analytics/DeferredGoftino";
import { JsonLd } from "@/components/seo/JsonLd";
import { assets, siteConfig } from "@/data/site";
import {
  absoluteAssetUrl,
  absoluteUrl,
  defaultKeywords,
  indexableRobots,
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.shortName,
  keywords: defaultKeywords,
  authors: [{ name: siteConfig.name, url: absoluteUrl("/") }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: absoluteUrl("/"),
    locale: "fa_IR",
    type: "website",
    siteName: siteConfig.name,
    images: [
      {
        url: absoluteAssetUrl(assets.logo),
        width: 512,
        height: 512,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [absoluteAssetUrl(assets.logo)],
  },
  robots: indexableRobots,
  category: "legal",
};

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  display: "swap",
  adjustFontFallback: true,
  variable: "--font-vazirmatn",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`h-full ${vazirmatn.variable} ${vazirmatn.className}`}
    >
      <body className={`${vazirmatn.className} flex min-h-full flex-col antialiased`}>
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <SiteLayout>{children}</SiteLayout>
        <DeferredGoftino />
      </body>
    </html>
  );
}
