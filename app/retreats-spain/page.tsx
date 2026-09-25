import type { Metadata } from "next";
import { PublicRetreatLanding } from "../components/PublicRetreatLanding";

const title = "Retreat Venue in Northern Spain | Origen Liencres";
const description =
  "Small coastal retreat venue in Northern Spain near Santander, with private accommodation for up to 8 guests, practice space, beaches and forest.";

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
        url: "/retreats-spain-costa-quebrada.jpg",
        width: 500,
        height: 333,
        alt: "The Urros rock formations on the Costa Quebrada coast in Cantabria",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/retreats-spain-costa-quebrada.jpg"],
  },
};

export default function RetreatsSpainPage() {
  return <PublicRetreatLanding language="en" />;
}
