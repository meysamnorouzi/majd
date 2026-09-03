import {
  PillarHubPage,
  generatePillarHubMetadata,
} from "@/components/services/PillarHubPage";
import type { Metadata } from "next";

const PREFIX = "criminal-defense-lawyer" as const;

export async function generateMetadata(): Promise<Metadata> {
  return generatePillarHubMetadata(PREFIX);
}

export default function CriminalDefenseLawyerHubPage() {
  return <PillarHubPage prefix={PREFIX} />;
}
