import type { Metadata } from "next";
import { PublicRetreatLanding } from "../components/PublicRetreatLanding";

const title = "Retreat Venue in Cantabria, Northern Spain | Origen Liencres";
const description =
  "A private retreat venue in Cantabria for organisers: accommodation for small groups, a nature-facing practice space and Atlantic landscape near Santander.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "retreat venue Cantabria",
    "retreat centre Northern Spain",
    "retreat venue near Santander",
    "host a retreat Spain",
    "small retreat venue Spain",
  ],
  alternates: {
    canonical: "https://www.origenliencres.com/retreats",
    languages: {
      "es-ES": "https://www.origenliencres.com/retiros",
      en: "https://www.origenliencres.com/retreats",
      "x-default": "https://www.origenliencres.com/retiros",
    },
  },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: "https://www.origenliencres.com/retreats",
    siteName: "Origen Liencres",
    locale: "en_GB",
    title,
    description,
    images: [{ url: "/og.png", width: 1536, height: 1024, alt: "Origen Liencres retreat venue in Cantabria" }],
  },
};

export default function RetreatsPage() {
  return <PublicRetreatLanding language="en" />;
}
