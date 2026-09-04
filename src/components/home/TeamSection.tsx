"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { TeamMemberCard } from "@/components/team/TeamMemberCard";
import { fetchTeamClient } from "@/lib/wordpress/client";
import { TEAM_LIST_PATH } from "@/lib/team-paths";
import type { TeamMember } from "@/types";

export function TeamSection() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchTeamClient()
      .then((data) => {
        if (!cancelled) setTeam(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <section className="bg-cream py-20 lg:py-28">
        <Container>
          <SectionTitle
            eyebrow="تیم حقوقی"
            title="وکلای متخصص موسسه مجد"
            description="وکلای پایه یک با تجربه در پرونده‌های پیچیده حقوقی و کیفری"
          />
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gold-500 border-t-transparent" />
          </div>
        </Container>
      </section>
    );
  }

  if (!team.length) return null;

  return (
    <section className="bg-cream py-20 lg:py-28">
      <Container>
        <SectionTitle
          eyebrow="تیم حقوقی"
          title="وکلای متخصص موسسه مجد"
          description="وکلای پایه یک با تجربه در پرونده‌های پیچیده حقوقی و کیفری"
        />
        <div
          className={`grid gap-8 sm:grid-cols-2 ${
            team.length === 1
              ? "mx-auto max-w-sm lg:grid-cols-1"
              : "lg:grid-cols-4"
          }`}
        >
          {team.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>
        {team.length > 1 && (
          <div className="mt-10 text-center">
            <Link
              href={TEAM_LIST_PATH}
              className="text-sm font-semibold text-navy-900 hover:text-gold-600"
            >
              مشاهده تمام اعضای تیم ←
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
}
