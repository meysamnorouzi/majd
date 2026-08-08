import type { Metadata } from "next";
import Script from "next/script";
import "@fontsource-variable/vazirmatn";
import { SiteLayout } from "@/components/layout/SiteLayout";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className="h-full">
      <body className="flex min-h-full flex-col antialiased">
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <SiteLayout>{children}</SiteLayout>
        <Script
          id="goftino-widget"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(){var i="x2AETb",a=window,d=document;function g(){var g=d.createElement("script"),s="https://www.goftino.com/widget/"+i,l=localStorage.getItem("goftino_"+i);g.async=!0,g.src=l?s+"?o="+l:s;d.getElementsByTagName("head")[0].appendChild(g);}"complete"===d.readyState?g():a.attachEvent?a.attachEvent("onload",g):a.addEventListener("load",g,!1);}();
              window.addEventListener("goftino_ready", function () {
                window.Goftino.setWidget({
                  marginLeft: 24,
                  marginBottom: 24,
                });
                var el = document.getElementById("goftino_w");
                if (el) {
                  el.style.setProperty("left", "24px", "important");
                  el.style.setProperty("right", "auto", "important");
                }
              });
            `,
          }}
        />
      </body>
    </html>
  );
}
