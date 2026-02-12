import type { Metadata } from "next";
import { SettingsPage } from "./settings-page";

export const metadata: Metadata = {
  title: "Settings | FlowState Pro",
};

export default function Settings() {
  return <SettingsPage />;
}
