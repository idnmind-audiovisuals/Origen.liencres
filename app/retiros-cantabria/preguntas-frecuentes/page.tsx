import type { Metadata } from "next";
import { PublicRetreatFaq } from "../../components/PublicRetreatFaq";

const title = "Preguntas sobre retiros en Cantabria | Origen Liencres";
const description =
  "Detalles prácticos sobre alojamiento, shala, capacidad, costa, accesos, privacidad y cómo organizar un retiro cerca de Santander en Origen Liencres.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/retiros-cantabria/preguntas-frecuentes",
    languages: {
      "es-ES": "/retiros-cantabria/preguntas-frecuentes",
      en: "/retreats-spain/faq",
    },
  },
  openGraph: {
    type: "article",
    url: "/retiros-cantabria/preguntas-frecuentes",
    title,
    description,
    locale: "es_ES",
    images: ["/experience-forest.webp"],
  },
};

export default function PreguntasFrecuentesPage() {
  return <PublicRetreatFaq language="es" />;
}
