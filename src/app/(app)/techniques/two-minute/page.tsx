import type { Metadata } from "next";
import { TwoMinuteWorkspace } from "./two-minute-workspace";

export const metadata: Metadata = {
  title: "Two-Minute Rule",
};

export default function TwoMinutePage() {
  return <TwoMinuteWorkspace />;
}
