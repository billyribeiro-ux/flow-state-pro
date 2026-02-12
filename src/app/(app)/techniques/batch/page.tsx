import type { Metadata } from "next";
import { BatchWorkspace } from "./batch-workspace";

export const metadata: Metadata = {
  title: "Batch Processing | FlowState Pro",
};

export default function BatchPage() {
  return <BatchWorkspace />;
}
