import type { Metadata } from "next";
import { AdminPage } from "./admin-page";

export const metadata: Metadata = {
  title: "Admin | FlowState Pro",
};

export default function Admin() {
  return <AdminPage />;
}
