import type { Metadata } from "next";
import { PublicRetreatFaq } from "../../components/PublicRetreatFaq";

const title = "Retreat venue FAQ | Origen Liencres, Cantabria";
const description =
  "Accommodation, capacity, beaches, private hire and how to host a small retreat near Santander at Origen Liencres.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/retreats-spain/faq",
    languages: {
      "es-ES": "/retiros-cantabria/preguntas-frecuentes",
      en: "/retreats-spain/faq",
    },
  },
  openGraph: {
    type: "article",
    url: "/retreats-spain/faq",
    title,
    description,
    locale: "en_GB",
    images: ["/experience-forest.webp"],
  },
};

export default function RetreatFaqPage() {
  return <PublicRetreatFaq language="en" />;
}
