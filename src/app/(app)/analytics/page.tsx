import type { Metadata } from "next";
import { AnalyticsPage } from "./analytics-page";

export const metadata: Metadata = {
  title: "Analytics | FlowState Pro",
};

export default function Analytics() {
  return <AnalyticsPage />;
}
