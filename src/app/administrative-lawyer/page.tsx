import {
  PillarHubPage,
  generatePillarHubMetadata,
} from "@/components/services/PillarHubPage";
import type { Metadata } from "next";

const PREFIX = "administrative-lawyer" as const;

export async function generateMetadata(): Promise<Metadata> {
  return generatePillarHubMetadata(PREFIX);
}

export default function AdministrativeLawyerHubPage() {
  return <PillarHubPage prefix={PREFIX} />;
}
