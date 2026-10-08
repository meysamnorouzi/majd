"use client";

import { useEffect, useState } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { ConsultationSection } from "@/components/contact/ConsultationSection";
import { PillarLandingBody } from "@/components/services/PillarLandingBody";
import { JsonLd } from "@/components/seo/JsonLd";
import { familyHubFallbackCards } from "@/data/family-sublandings";
import { portraitObjectPosition } from "@/data/site";
import { getPillar, landingFromPillar } from "@/data/pillars";
import {
  applyPillarLandingCards,
  getPillarLanding,
  type PillarLanding,
} from "@/data/pillar-landings";
import { fetchLandingByPrefixClient } from "@/lib/wordpress/landings";
import { fetchServicesClient } from "@/lib/wordpress/services";
import {
  fetchServiceHubClient,
  landingFromServiceHub,
  landingToService,
  serviceHubApiInstalled,
} from "@/lib/wordpress/service-landings";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
} from "@/lib/seo";
import {
  getPillarLeavesFromTree,
  hubPath,
  isServiceCategoryPrefix,
  servicePath,
} from "@/lib/service-paths";
import type { Service } from "@/types";

export function PillarHubContent({ prefix }: { prefix: string }) {
  const pillar = isServiceCategoryPrefix(prefix) ? getPillar(prefix) : undefined;
  const [landing, setLanding] = useState<PillarLanding | null>(null);
  const [cards, setCards] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [landingError, setLandingError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const installed = await serviceHubApiInstalled();
        if (cancelled) return;

        if (installed) {
          const hub = await fetchServiceHubClient(prefix);
          if (cancelled) return;
          if (hub) {
            const nextLanding = landingFromServiceHub(hub);
            setLanding(nextLanding);
            const nextCards = hub.landings.map((item) =>
              landingToService(hub, item),
            );
            setCards(
              nextCards.length || prefix !== "family-lawyer"
                ? nextCards
                : familyHubFallbackCards(),
            );
            document.title = `${nextLanding.seoTitle} | موسسه حقوقی مجد`;
            setLoading(false);
            return;
          }
          if (pillar && isServiceCategoryPrefix(prefix)) {
            const fallback = getPillarLanding(prefix) ?? landingFromPillar(pillar);
            setLanding(fallback);
            setCards(prefix === "family-lawyer" ? familyHubFallbackCards() : []);
            setLoading(false);
            return;
          }
          setLandingError("این لندینگ پیدا نشد.");
          setLoading(false);
          return;
        }

        if (!pillar || !isServiceCategoryPrefix(prefix)) {
          setLandingError("بارگذاری این صفحه انجام نشد.");
          setLoading(false);
          return;
        }

        const nextLanding = await Promise.race([
          fetchLandingByPrefixClient(prefix),
          new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error("timeout")), 8000);
          }),
        ]);
        if (cancelled) return;
        setLanding(nextLanding);
        document.title = `${nextLanding.seoTitle} | موسسه حقوقی مجد`;

        try {
          const menu = await Promise.race([
            fetchServicesClient(),
            new Promise<never>((_, reject) => {
              setTimeout(() => reject(new Error("timeout")), 8000);
            }),
          ]);
          if (cancelled) return;
          const leaves = getPillarLeavesFromTree(
            menu.megaTrees.find((tree) => tree.categoryPrefix === prefix),
          ).map((service) => ({ ...service, hubSlug: prefix }));
          setCards(applyPillarLandingCards(leaves, nextLanding));
        } catch {
          if (!cancelled) {
            setCards(prefix === "family-lawyer" ? familyHubFallbackCards() : []);
          }
        }
      } catch {
        if (cancelled) return;
        if (pillar && isServiceCategoryPrefix(prefix)) {
          const fallback =
            getPillarLanding(prefix) ?? landingFromPillar(pillar);
          setLanding(fallback);
          setCards(prefix === "family-lawyer" ? familyHubFallbackCards() : []);
          document.title = `${fallback.seoTitle} | موسسه حقوقی مجد`;
        } else {
          setLandingError("بارگذاری این صفحه انجام نشد.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pillar, prefix]);

  const path = hubPath(prefix);
  const pageName = landing?.heroTitle ?? pillar?.title ?? "خدمات حقوقی";
  const pageDescription = landing?.seoDescription ?? pillar?.excerpt ?? "";
  const heroImage = landing?.image ?? pillar?.image;
  const crumb = pillar?.title ?? landing?.heroTitle ?? pageName;

  return (
    <>
      {landing ? (
        <JsonLd
          data={[
            breadcrumbJsonLd([
              { name: "خانه", path: "/" },
              { name: crumb, path },
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
                  url: absoluteUrl(servicePath(service, prefix)),
                })),
              },
            },
            ...(landing.faqs.length ? [faqJsonLd(landing.faqs)] : []),
          ]}
        />
      ) : null}

      <PageHero
        title={pageName}
        description={landing?.heroDescription ?? pillar?.excerpt ?? ""}
        breadcrumb={[{ label: crumb }]}
        image={heroImage}
        imagePosition={
          heroImage ? (portraitObjectPosition(heroImage) ?? "center 28%") : "center 28%"
        }
        compactTitle
      />

      {landingError ? (
        <p className="py-16 text-center text-slate-600">{landingError}</p>
      ) : null}

      {landingError ? null : loading || !landing ? (
        <div className="flex justify-center py-24">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gold-500 border-t-transparent" />
        </div>
      ) : (
        <PillarLandingBody
          landing={landing}
          cards={cards}
          defaultSubject={pillar?.title ?? pageName}
        />
      )}

      <ConsultationSection
        title={landing?.cta.formTitle ?? "فرم مشاوره"}
        description={
          landing?.cta.formDescription ??
          `موضوع پرونده ${pillar?.title ?? pageName} را بنویسید؛ کارشناسان موسسه با شما تماس می‌گیرند.`
        }
        defaultSubject={pillar?.title ?? pageName}
        defaultMessage={`درخواست مشاوره برای ${pillar?.title ?? pageName}`}
      />
    </>
  );
}
