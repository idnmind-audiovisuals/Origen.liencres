import type { Metadata } from "next";
import { BrosState } from "../components/BrosState";
import {
  MEN_CIRCLE_DESCRIPTION,
  MEN_CIRCLE_FAQS,
  MEN_CIRCLE_TITLE,
} from "../lib/circle-seo";

const SITE_URL = "https://www.origenliencres.com";
const PAGE_URL = `${SITE_URL}/circulo-de-hombres`;

export const metadata: Metadata = {
  title: MEN_CIRCLE_TITLE,
  description: MEN_CIRCLE_DESCRIPTION,
  keywords: [
    "círculo de hombres Cantabria",
    "círculo de hombres Santander",
    "grupo de hombres Liencres",
    "men's circle Cantabria",
    "accountability hombres",
    "Origen Bros",
  ],
  alternates: { canonical: "/circulo-de-hombres" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: MEN_CIRCLE_TITLE,
    description: MEN_CIRCLE_DESCRIPTION,
    siteName: "Origen Liencres",
    locale: "es_ES",
    images: [
      {
        url: "/og.png",
        width: 1536,
        height: 1024,
        alt: "Círculo de hombres en Origen Liencres, Cantabria",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: MEN_CIRCLE_TITLE,
    description: MEN_CIRCLE_DESCRIPTION,
    images: ["/og.png"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: MEN_CIRCLE_TITLE,
      description: MEN_CIRCLE_DESCRIPTION,
      inLanguage: "es-ES",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${PAGE_URL}#service` },
    },
    {
      "@type": "Service",
      "@id": `${PAGE_URL}#service`,
      name: "Círculo de hombres de Origen",
      serviceType: "Círculo semanal de hombres",
      description: MEN_CIRCLE_DESCRIPTION,
      url: PAGE_URL,
      provider: { "@id": `${SITE_URL}/#organization` },
      areaServed: { "@type": "AdministrativeArea", name: "Cantabria" },
      availableChannel: {
        "@type": "ServiceChannel",
        serviceUrl: PAGE_URL,
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${PAGE_URL}#faq`,
      mainEntity: MEN_CIRCLE_FAQS.map((item) => ({
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
          name: "Círculo de hombres",
          item: PAGE_URL,
        },
      ],
    },
  ],
};

export default function MensCirclePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <BrosState development={false} />
    </>
  );
}
