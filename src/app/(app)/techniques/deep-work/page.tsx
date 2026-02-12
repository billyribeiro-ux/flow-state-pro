import type { Metadata } from "next";
import { DeepWorkWorkspace } from "./deep-work-workspace";

export const metadata: Metadata = {
  title: "Deep Work | FlowState Pro",
};

export default function DeepWorkPage() {
  return <DeepWorkWorkspace />;
}
