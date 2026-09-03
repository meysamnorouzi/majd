import {
  PillarHubPage,
  generatePillarHubMetadata,
} from "@/components/services/PillarHubPage";
import type { Metadata } from "next";

const PREFIX = "property-lawyer" as const;

export async function generateMetadata(): Promise<Metadata> {
  return generatePillarHubMetadata(PREFIX);
}

export default function PropertyLawyerHubPage() {
  return <PillarHubPage prefix={PREFIX} />;
}
