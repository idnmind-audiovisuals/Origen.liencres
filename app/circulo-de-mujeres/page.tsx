import type { Metadata } from "next";
import { WomensCircleState } from "../components/WomensCircleState";
import {
  WOMEN_CIRCLE_DESCRIPTION,
  WOMEN_CIRCLE_FAQS,
  WOMEN_CIRCLE_TITLE,
} from "../lib/circle-seo";

const SITE_URL = "https://www.origenliencres.com";
const PAGE_URL = `${SITE_URL}/circulo-de-mujeres`;
const WHATSAPP_URL =
  "https://chat.whatsapp.com/KW3qQoKiLUk4LZIA0xZD5E?s=cl&p=i&mlu=0";

export const metadata: Metadata = {
  title: WOMEN_CIRCLE_TITLE,
  description: WOMEN_CIRCLE_DESCRIPTION,
  keywords: [
    "círculo de mujeres Cantabria",
    "círculo de mujeres Santander",
    "grupo de mujeres Liencres",
    "women's circle Cantabria",
    "encuentro de mujeres",
    "Origen Liencres",
  ],
  alternates: { canonical: "/circulo-de-mujeres" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: WOMEN_CIRCLE_TITLE,
    description: WOMEN_CIRCLE_DESCRIPTION,
    siteName: "Origen Liencres",
    locale: "es_ES",
    images: [
      {
        url: "/women-circle-organic.jpg?v=5",
        width: 643,
        height: 360,
        alt: "Círculo de mujeres en Origen Liencres, Cantabria",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: WOMEN_CIRCLE_TITLE,
    description: WOMEN_CIRCLE_DESCRIPTION,
    images: ["/women-circle-organic.jpg?v=5"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: WOMEN_CIRCLE_TITLE,
      description: WOMEN_CIRCLE_DESCRIPTION,
      inLanguage: "es-ES",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${PAGE_URL}#service` },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: `${SITE_URL}/women-circle-organic.jpg?v=5`,
        width: 643,
        height: 360,
      },
    },
    {
      "@type": "Service",
      "@id": `${PAGE_URL}#service`,
      name: "Círculo de mujeres de Origen",
      serviceType: "Círculo semanal de mujeres",
      description: WOMEN_CIRCLE_DESCRIPTION,
      url: PAGE_URL,
      provider: { "@id": `${SITE_URL}/#organization` },
      areaServed: { "@type": "AdministrativeArea", name: "Cantabria" },
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "https://schema.org/Tuesday",
        opens: "18:00",
        closes: "20:00",
      },
      availableChannel: {
        "@type": "ServiceChannel",
        serviceUrl: WHATSAPP_URL,
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${PAGE_URL}#faq`,
      mainEntity: WOMEN_CIRCLE_FAQS.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Origen Liencres",
          item: `${SITE_URL}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Círculo de mujeres",
          item: PAGE_URL,
        },
      ],
    },
  ],
};

export default function WomensCirclePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <WomensCircleState />
    </>
  );
}
