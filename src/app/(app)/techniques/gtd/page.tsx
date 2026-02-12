import type { Metadata } from "next";
import { GtdWorkspace } from "./gtd-workspace";

export const metadata: Metadata = {
  title: "Getting Things Done | FlowState Pro",
};

export default function GtdPage() {
  return <GtdWorkspace />;
}
