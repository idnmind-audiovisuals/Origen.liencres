import type { Metadata } from "next";
import { HomeSectionPlaceholder } from "../components/HomeSectionPlaceholder";

export const metadata: Metadata = {
  title: "Eventos — Origen Liencres",
  description:
    "Próximos encuentros y eventos en Origen Liencres, Cantabria.",
  alternates: { canonical: "/eventos-bienestar-cantabria" },
};

export default function EventsPage() {
  return (
    <HomeSectionPlaceholder
      eyebrow="Eventos"
      title="Próximos encuentros en Origen."
      description="Estamos preparando la agenda. Las nuevas fechas y propuestas aparecerán aquí."
    />
  );
}
