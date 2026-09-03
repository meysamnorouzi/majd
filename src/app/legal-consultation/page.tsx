import {
  PillarHubPage,
  generatePillarHubMetadata,
} from "@/components/services/PillarHubPage";
import type { Metadata } from "next";

const PREFIX = "legal-consultation" as const;

export async function generateMetadata(): Promise<Metadata> {
  return generatePillarHubMetadata(PREFIX);
}

export default function LegalConsultationHubPage() {
  return <PillarHubPage prefix={PREFIX} />;
}
