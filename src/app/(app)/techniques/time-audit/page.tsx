import type { Metadata } from "next";
import { TimeAuditWorkspace } from "./time-audit-workspace";

export const metadata: Metadata = {
  title: "Time Audit | FlowState Pro",
};

export default function TimeAuditPage() {
  return <TimeAuditWorkspace />;
}
