import type { Metadata } from "next";
import "@fontsource-variable/vazirmatn";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { assets, siteConfig } from "@/data/site";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    locale: "fa_IR",
    type: "website",
    siteName: siteConfig.name,
    images: [{ url: assets.logo, width: 512, height: 512, alt: siteConfig.name }],
  },
  icons: {
    icon: [{ url: assets.logo, type: "image/png" }],
    shortcut: assets.logo,
    apple: assets.logo,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className="h-full">
      <body className="flex min-h-full flex-col antialiased">
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
}
