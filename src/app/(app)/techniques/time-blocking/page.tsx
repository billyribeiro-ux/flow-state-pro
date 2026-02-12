import type { Metadata } from "next";
import { TimeBlockingWorkspace } from "./time-blocking-workspace";

export const metadata: Metadata = {
  title: "Time Blocking",
};

export default function TimeBlockingPage() {
  return <TimeBlockingWorkspace />;
}
