import type { Metadata } from "next";
import { BrosState } from "../components/BrosState";
import { requireOrigenAccess } from "../lib/require-access";

const title = "Origen Bros — Liencres";
const description =
  "Un espacio para hombres donde encontrarse con autenticidad, presencia, responsabilidad y crecimiento.";

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

export default async function BrosPage() {
  await requireOrigenAccess("bros");

  return <BrosState development={false} />;
}
