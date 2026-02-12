import type { Metadata } from "next";
import { MethodologyGrid } from "@/components/onboarding/methodology-grid";

export const metadata: Metadata = {
  title: "Choose Your Technique",
};

export default function OnboardingPage() {
  return (
    <div className="mx-auto max-w-5xl py-8">
      <MethodologyGrid />
    </div>
  );
}
