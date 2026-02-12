import type { Metadata } from "next";
import { PomodoroWorkspace } from "./pomodoro-workspace";

export const metadata: Metadata = {
  title: "Pomodoro Timer",
};

export default function PomodoroPage() {
  return <PomodoroWorkspace />;
}
