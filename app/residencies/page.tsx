import type { Metadata } from "next";
import { ResidenciesHub } from "../components/ResidenciesHub";

export const metadata: Metadata = {
  title: "Host a Residency in Cantabria | Origen Liencres",
  description: "A private venue for organisers of artist, coworking and entrepreneur residencies in Liencres, Cantabria, for groups of up to 8 people.",
  alternates: { canonical: "/residencies", languages: { "es-ES": "/residencias", en: "/residencies", "x-default": "/residencias" } },
  robots: { index: true, follow: true },
};

export default function ResidenciesPage() {
  return <ResidenciesHub language="en" />;
}
