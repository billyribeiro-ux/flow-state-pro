import type { Metadata } from "next";
import { EatTheFrogWorkspace } from "./eat-the-frog-workspace";

export const metadata: Metadata = {
  title: "Eat The Frog | FlowState Pro",
};

export default function EatTheFrogPage() {
  return <EatTheFrogWorkspace />;
}
