import type { Metadata } from "next";
import { PublicRetreatLanding } from "../components/PublicRetreatLanding";

const title = "Centro y Espacio para Retiros en Cantabria | Origen Liencres";
const description =
  "Origen Liencres es un centro y espacio privado para organizar retiros en Cantabria: alojamiento para grupos pequeños, shala y naturaleza cerca de Santander.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "centro de retiros en Cantabria",
    "espacio para retiros en Cantabria",
    "casa para retiros Cantabria",
    "alojamiento para retiros Cantabria",
    "organizar retiro Cantabria",
    "retiros cerca de Santander",
  ],
  alternates: {
    canonical: "https://www.origenliencres.com/retiros",
    languages: {
      "es-ES": "https://www.origenliencres.com/retiros",
      en: "https://www.origenliencres.com/retreats",
      "x-default": "https://www.origenliencres.com/retiros",
    },
  },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: "https://www.origenliencres.com/retiros",
    siteName: "Origen Liencres",
    locale: "es_ES",
    title,
    description,
    images: [{ url: "/og.png", width: 1536, height: 1024, alt: "Origen Liencres, espacio para retiros en Cantabria" }],
  },
};

export default function RetirosPage() {
  return <PublicRetreatLanding language="es" />;
}
