import type { Metadata } from "next";
import { EisenhowerWorkspace } from "./eisenhower-workspace";

export const metadata: Metadata = {
  title: "Eisenhower Matrix",
};

export default function EisenhowerPage() {
  return <EisenhowerWorkspace />;
}
