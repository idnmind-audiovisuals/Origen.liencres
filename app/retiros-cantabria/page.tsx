import type { Metadata } from "next";
import { PublicRetreatLanding } from "../components/PublicRetreatLanding";

const title = "Espacio para retiros en Cantabria | Origen Liencres";
const description =
  "Alojamiento para retiros en Cantabria, cerca de Santander, las playas y el bosque de Costa Quebrada. Espacio privado para grupos de hasta 8 personas.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "espacio para retiros Cantabria",
    "alojamiento para retiros Cantabria",
    "organizar retiro Cantabria",
    "retiros cerca de Santander",
    "retiros naturaleza Cantabria",
    "retiros cerca de la playa Cantabria",
  ],
  alternates: {
    canonical: "/retiros-cantabria",
    languages: {
      "es-ES": "/retiros-cantabria",
      en: "/retreats-spain",
      "x-default": "/retiros-cantabria",
    },
  },
  openGraph: {
    type: "website",
    url: "/retiros-cantabria",
    title,
    description,
    locale: "es_ES",
    alternateLocale: ["en_GB"],
    images: [
      {
        url: "/experience-coast.webp",
        width: 1536,
        height: 1024,
        alt: "Costa Quebrada en Liencres, Cantabria",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/experience-coast.webp"],
  },
};

export default function RetirosCantabriaPage() {
  return <PublicRetreatLanding language="es" />;
}
