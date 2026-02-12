import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { METHODOLOGIES, METHODOLOGY_IDS, type MethodologyId } from "@/lib/constants/methodologies";
import { MethodologyDeepDive } from "./methodology-deep-dive";

interface PageProps {
  params: Promise<{ methodology: string }>;
}

function findMethodologyBySlug(slug: string): MethodologyId | null {
  return (
    METHODOLOGY_IDS.find((id) => METHODOLOGIES[id].slug === slug) ?? null
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { methodology: slug } = await params;
  const id = findMethodologyBySlug(slug);
  if (!id) return { title: "Not Found" };
  return { title: `Learn ${METHODOLOGIES[id].name}` };
}

export default async function MethodologyOnboardingPage({ params }: PageProps) {
  const { methodology: slug } = await params;
  const id = findMethodologyBySlug(slug);
  if (!id) notFound();

  const methodology = METHODOLOGIES[id];

  return (
    <div className="mx-auto max-w-3xl py-8">
      <MethodologyDeepDive methodology={methodology} />
    </div>
  );
}
