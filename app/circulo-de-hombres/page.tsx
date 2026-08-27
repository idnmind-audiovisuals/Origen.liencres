import type { Metadata } from "next";
import { BrosState } from "../components/BrosState";
import { requireOrigenAccess } from "../lib/require-access";

const title = "Círculo de hombres — Origen";
const description =
  "Un espacio de autenticidad para hombres, presencia, responsabilidad y crecimiento en Liencres.";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title,
  description,
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

export default async function MensCirclePage() {
  await requireOrigenAccess("bros");

  return <BrosState development={false} />;
}
