"use client";

import { useEffect, useState } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { ConsultationSection } from "@/components/contact/ConsultationSection";
import { PillarLandingBody } from "@/components/services/PillarLandingBody";
import { JsonLd } from "@/components/seo/JsonLd";
import { portraitObjectPosition } from "@/data/site";
import { getPillar } from "@/data/pillars";
import {
  applyPillarLandingCards,
  type PillarLanding,
} from "@/data/pillar-landings";
import { fetchLandingByPrefixClient } from "@/lib/wordpress/landings";
import { fetchServicesClient } from "@/lib/wordpress/services";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
} from "@/lib/seo";
import {
  getPillarLeavesFromTree,
  hubPath,
  servicePath,
  type ServiceCategoryPrefix,
} from "@/lib/service-paths";
import type { Service } from "@/types";

export function PillarHubContent({
  prefix,
}: {
  prefix: ServiceCategoryPrefix;
}) {
  const pillar = getPillar(prefix);
  const [landing, setLanding] = useState<PillarLanding | null>(null);
  const [cards, setCards] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const [nextLanding, menu] = await Promise.all([
        fetchLandingByPrefixClient(prefix),
        fetchServicesClient(),
      ]);
      if (cancelled) return;

      const leaves = getPillarLeavesFromTree(
        menu.megaTrees.find((tree) => tree.categoryPrefix === prefix),
      );
      setLanding(nextLanding);
      setCards(applyPillarLandingCards(leaves, nextLanding));
      document.title = `${nextLanding.seoTitle} | موسسه حقوقی مجد`;
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [prefix]);

  if (!pillar) return null;

  const path = hubPath(prefix);
  const pageName = landing?.heroTitle ?? pillar.title;
  const pageDescription = landing?.seoDescription ?? pillar.excerpt;
  const heroImage = landing?.image ?? pillar.image;

  return (
    <>
      {landing ? (
        <JsonLd
          data={[
            breadcrumbJsonLd([
              { name: "خانه", path: "/" },
              { name: pillar.title, path },
            ]),
            {
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: pageName,
              description: pageDescription,
              url: absoluteUrl(path),
              mainEntity: {
                "@type": "ItemList",
                numberOfItems: cards.length,
                itemListElement: cards.map((service, index) => ({
                  "@type": "ListItem",
                  position: index + 1,
                  name: service.title,
                  url: absoluteUrl(servicePath(service)),
                })),
              },
            },
            ...(landing.faqs.length ? [faqJsonLd(landing.faqs)] : []),
          ]}
        />
      ) : null}

      <PageHero
        title={pageName}
        description={landing?.heroDescription ?? pillar.excerpt}
        breadcrumb={[{ label: pillar.title }]}
        image={heroImage}
        imagePosition={portraitObjectPosition(heroImage) ?? "center 28%"}
        compactTitle
      />

      {loading || !landing ? (
        <div className="flex justify-center py-24">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gold-500 border-t-transparent" />
        </div>
      ) : (
        <PillarLandingBody
          landing={landing}
          cards={cards}
          defaultSubject={pillar.title}
        />
      )}

      <ConsultationSection
        title={landing?.cta.formTitle ?? "فرم مشاوره"}
        description={
          landing?.cta.formDescription ??
          `موضوع پرونده ${pillar.title} را بنویسید؛ کارشناسان موسسه با شما تماس می‌گیرند.`
        }
        defaultSubject={pillar.title}
        defaultMessage={`درخواست مشاوره برای ${pillar.title}`}
      />
    </>
  );
}
