import type { Metadata } from "next";
import { PublicRetreatLanding } from "../components/PublicRetreatLanding";

const title = "Retreat venue in Northern Spain | Origen Liencres";
const description =
  "Private retreat venue in Cantabria near Santander, the Atlantic Ocean and coastal forest. Accommodation for small groups of up to 8 guests.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "retreat venue Cantabria",
    "retreat venue Northern Spain",
    "retreat venue near Santander",
    "retreat center by the beach Spain",
    "small retreat venue Spain",
    "creative residency Northern Spain",
  ],
  alternates: {
    canonical: "/retreats-spain",
    languages: {
      "es-ES": "/retiros-cantabria",
      en: "/retreats-spain",
      "x-default": "/retiros-cantabria",
    },
  },
  openGraph: {
    type: "website",
    url: "/retreats-spain",
    title,
    description,
    locale: "en_GB",
    alternateLocale: ["es_ES"],
    images: [
      {
        url: "/experience-coast.webp",
        width: 1536,
        height: 1024,
        alt: "Costa Quebrada cliffs in Liencres, Cantabria",
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

export default function RetreatsSpainPage() {
  return <PublicRetreatLanding language="en" />;
}
