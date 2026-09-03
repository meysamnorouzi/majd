import {
  PillarHubPage,
  generatePillarHubMetadata,
} from "@/components/services/PillarHubPage";
import type { Metadata } from "next";

const PREFIX = "family-lawyer" as const;

export async function generateMetadata(): Promise<Metadata> {
  return generatePillarHubMetadata(PREFIX);
}

export default function FamilyLawyerHubPage() {
  return <PillarHubPage prefix={PREFIX} />;
}
