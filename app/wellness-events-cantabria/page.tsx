import type { Metadata } from "next";
import { EventOrganizerLanding } from "../components/EventOrganizerLanding";

export const metadata: Metadata = {
  title: "Host a Wellness Event in Cantabria | Origen Liencres",
  description: "An intimate venue in Liencres for organisers, facilitators and brands producing private wellness and community events in Cantabria.",
  alternates: { canonical: "/wellness-events-cantabria", languages: { "es-ES": "/eventos-bienestar-cantabria", en: "/wellness-events-cantabria", "x-default": "/eventos-bienestar-cantabria" } },
  robots: { index: true, follow: true },
};

export default function WellnessEventsCantabriaPage() {
  return <EventOrganizerLanding language="en" />;
}
