"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { TeamMemberCard } from "@/components/team/TeamMemberCard";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { fetchTeamClient } from "@/lib/wordpress/client";
import type { TeamMember } from "@/types";

export function TeamPageContent() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    (async () => {
      try {
        const data = await fetchTeamClient();
        if (!cancelled) setTeam(data);
      } catch {
        if (!cancelled) setError("بارگذاری اعضای تیم انجام نشد.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <section className="py-20">
        <Container>
          <SectionTitle
            title="تیم حقوقی ما"
            description="هر یک از وکلای موسسه در حوزه تخصصی خود سال‌ها تجربه عملی دارند."
          />
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gold-500 border-t-transparent" />
          </div>
        </Container>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20">
        <Container>
          <p className="py-16 text-center text-slate-600">{error}</p>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-20">
      <Container>
        <SectionTitle
          title="تیم حقوقی ما"
          description="هر یک از وکلای موسسه در حوزه تخصصی خود سال‌ها تجربه عملی دارند."
        />
        <Stagger
          className={`grid gap-10 sm:grid-cols-2 ${
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
      </Container>
    </section>
  );
}
