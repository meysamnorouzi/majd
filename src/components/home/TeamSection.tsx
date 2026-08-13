"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fallbackTeamMembers } from "@/data/site";
import { fetchTeamClient } from "@/lib/wordpress/client";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { TeamMemberCard } from "@/components/team/TeamMemberCard";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import type { TeamMember } from "@/types";

export function TeamSection() {
  const [team, setTeam] = useState<TeamMember[]>(fallbackTeamMembers);

  useEffect(() => {
    let cancelled = false;
    fetchTeamClient().then((members) => {
      if (!cancelled && members.length) setTeam(members);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!team.length) return null;

  return (
    <section className="bg-cream py-20 lg:py-28">
      <Container>
        <SectionTitle
          eyebrow="تیم حقوقی"
          title="وکلای متخصص موسسه مجد"
          description="وکلای پایه یک با تجربه در پرونده‌های پیچیده حقوقی و کیفری"
        />
        <Stagger
          className={`grid gap-8 sm:grid-cols-2 ${
            team.length === 1
              ? "mx-auto max-w-sm lg:grid-cols-1"
              : "lg:grid-cols-4"
          }`}
          stagger={0.1}
        >
          {team.map((member) => (
            <StaggerItem key={member.id} variant="up">
              <TeamMemberCard member={member} />
            </StaggerItem>
          ))}
        </Stagger>
        {team.length > 1 && (
          <Reveal className="mt-10 text-center" delay={0.1}>
            <Link
              href="/team/"
              className="text-sm font-semibold text-navy-900 hover:text-gold-600"
            >
              مشاهده تمام اعضای تیم ←
            </Link>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
