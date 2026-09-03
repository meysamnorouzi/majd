import type { Metadata } from "next";
import {
  CategoryServicePage,
  categoryServiceMetadata,
  categoryStaticParams,
} from "@/components/services/CategoryServicePage";

const PREFIX = "administrative-lawyer" as const;

export async function generateStaticParams() {
  return categoryStaticParams(PREFIX);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return categoryServiceMetadata(PREFIX, slug);
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CategoryServicePage prefix={PREFIX} slug={slug} />;
}
