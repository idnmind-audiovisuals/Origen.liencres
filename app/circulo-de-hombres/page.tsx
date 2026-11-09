import type { Metadata } from "next";
import { BrosState } from "../components/BrosState";

const title = "Círculo de hombres — Origen";
const description =
  "Un espacio de autenticidad para hombres, presencia, responsabilidad y crecimiento en Liencres.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/circulo-de-hombres" },
  openGraph: {
    type: "website",
    title,
    description,
    siteName: "Origen",
    images: [],
  },
  twitter: {
    card: "summary",
    title,
    description,
    images: [],
  },
};

export default function MensCirclePage() {
  return <BrosState development={false} />;
}
