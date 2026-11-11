import type { Metadata } from "next";
import { MensCircleDashboard } from "../../components/MensCircleDashboard";

export const metadata: Metadata = {
  title: "Dashboard personal | Origen Bros",
  description: "Espacio personal de seguimiento, intenciones, reflexiones y apoyo del círculo de hombres Origen Bros.",
  robots: { index: false, follow: false, nocache: true },
};

export default function MensCircleDashboardPage() {
  return <MensCircleDashboard />;
}
