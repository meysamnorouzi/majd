"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/motion/reveal";
import { portraitObjectPosition } from "@/data/site";
import type { TeamMember } from "@/types";

const EASE = [0.22, 1, 0.36, 1] as const;

export function TeamMemberHero({ member }: { member: TeamMember }) {
  const reduced = useReducedMotion();
  const banner = member.bannerImage ?? member.image;
  const portraitPosition =
    portraitObjectPosition(member.image) ?? "center 15%";

  return (
    <section className="relative isolate overflow-hidden bg-navy-950 text-white">
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          initial={reduced ? false : { scale: 1.08, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: reduced ? 0.01 : 1.4, ease: EASE }}
        >
          <Image
            src={banner}
            alt=""
            fill
            priority
            className={`object-cover object-[center_28%] ${reduced ? "" : "ken-burns"}`}
            sizes="100vw"
            aria-hidden
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-l from-navy-950 via-navy-950/88 to-navy-950/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-navy-950/55" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(212,175,55,0.12),transparent_55%)]" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-l from-transparent via-gold-400/40 to-transparent" />

      <Container className="relative py-14 sm:py-16 lg:py-24">
        <FadeIn delay={0.05}>
          <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-white/55">
            <Link href="/" className="transition hover:text-gold-400">
              خانه
            </Link>
            <span>/</span>
            <Link href="/team/" className="transition hover:text-gold-400">
              اعضای تیم
            </Link>
            <span>/</span>
            <span className="line-clamp-1 text-gold-400">{member.name}</span>
          </nav>
        </FadeIn>

        <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <FadeIn delay={0.12}>
              <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/35 bg-white/5 px-4 py-1.5 text-sm text-gold-400 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
                {member.specialty}
              </span>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h1 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                {member.name}
              </h1>
            </FadeIn>

            <FadeIn delay={0.28}>
              <p className="mt-3 text-lg text-gold-400/95 sm:text-xl">
                {member.role}
              </p>
            </FadeIn>

            <FadeIn delay={0.36}>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
                {member.bio}
              </p>
            </FadeIn>

            <FadeIn delay={0.44}>
              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/85 backdrop-blur-sm">
                  {member.experienceYears} سال تجربه
                </span>
                <span className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur-sm">
                  {member.education}
                </span>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.3} className="hidden lg:col-span-5 lg:block">
            <div className="relative mx-auto max-w-sm overflow-hidden rounded-2xl border border-gold-400/25 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.65)] ring-1 ring-white/10">
              <div className="relative aspect-[4/5]">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  priority
                  className="portrait-filter object-cover"
                  style={{ objectPosition: portraitPosition }}
                  sizes="320px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-navy-950/20" />
              </div>
              <div className="absolute inset-x-0 bottom-0 border-t border-gold-400/20 bg-navy-950/75 p-5 backdrop-blur-md">
                <p className="font-bold text-white">{member.name}</p>
                <p className="mt-1 text-sm text-gold-400">{member.specialty}</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}
