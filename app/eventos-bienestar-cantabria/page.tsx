import type { Metadata } from "next";
import { EventOrganizerLanding } from "../components/EventOrganizerLanding";

export const metadata: Metadata = {
  title: "Organizar eventos de bienestar en Cantabria | Origen",
  description: "Espacio íntimo en Liencres para organizadores, facilitadores y marcas que producen eventos privados de bienestar y comunidad en Cantabria.",
  alternates: { canonical: "/eventos-bienestar-cantabria", languages: { "es-ES": "/eventos-bienestar-cantabria", en: "/wellness-events-cantabria", "x-default": "/eventos-bienestar-cantabria" } },
  robots: { index: true, follow: true },
};

export default function WellnessEventsCantabriaPage() {
  return <EventOrganizerLanding language="es" />;
}
