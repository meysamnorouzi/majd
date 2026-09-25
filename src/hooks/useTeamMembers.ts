"use client";

import { useEffect, useState } from "react";
import { fetchTeamClient, toLawyerOptions } from "@/lib/wordpress/client";
import type { TeamMember } from "@/types";

export function useTeamMembers() {
  const [members, setMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchTeamClient().then((team) => {
      if (!cancelled && team.length) {
        setMembers(team);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return members;
}

export function useLawyerOptions() {
  const members = useTeamMembers();
  return toLawyerOptions(members);
}
