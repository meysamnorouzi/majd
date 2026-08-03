"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/motion/reveal";
import { assets } from "@/data/site";

export function PageHero({
  title,
  description,
  breadcrumb,
}: {
  title: string;
  description?: string;
  breadcrumb?: { label: string; href?: string }[];
}) {
  return (
    <section className="relative overflow-hidden bg-navy-900 py-12 text-white sm:py-16 lg:py-20">
      <div
        className="absolute inset-0 opacity-20 bg-cover bg-center"
        style={{
          backgroundImage: `url(${assets.lawBooks})`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-l from-navy-950/90 to-navy-800/80" />
      <Container className="relative">
        {breadcrumb && (
          <FadeIn delay={0.05}>
            <nav className="mb-4 flex flex-wrap items-center gap-2 text-sm text-white/60">
              <Link href="/" className="hover:text-gold-400">
                خانه
              </Link>
              {breadcrumb.map((item, i) => (
                <span key={i} className="flex items-center gap-2">
                  <span>/</span>
                  {item.href ? (
                    <Link href={item.href} className="hover:text-gold-400">
                      {item.label}
                    </Link>
                  ) : (
                    <span className="line-clamp-1 text-gold-400">{item.label}</span>
                  )}
                </span>
              ))}
            </nav>
          </FadeIn>
        )}
        <FadeIn delay={0.12}>
          <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">{title}</h1>
        </FadeIn>
        {description && (
          <FadeIn delay={0.22}>
            <p className="mt-4 max-w-2xl text-base text-white/75 sm:text-lg">
              {description}
            </p>
          </FadeIn>
        )}
      </Container>
    </section>
  );
}
