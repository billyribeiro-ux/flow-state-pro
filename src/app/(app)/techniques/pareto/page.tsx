import type { Metadata } from "next";
import { ParetoWorkspace } from "./pareto-workspace";

export const metadata: Metadata = {
  title: "80/20 Rule | FlowState Pro",
};

export default function ParetoPage() {
  return <ParetoWorkspace />;
}
