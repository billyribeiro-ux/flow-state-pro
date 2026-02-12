import type { Metadata } from "next";
import { CoachPage } from "./coach-page";

export const metadata: Metadata = {
  title: "AI Coach | FlowState Pro",
};

export default function Coach() {
  return <CoachPage />;
}
