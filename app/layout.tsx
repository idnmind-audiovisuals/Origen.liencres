import type { Metadata } from "next";
import "@fontsource-variable/montserrat";
import "./globals.css";
import { ORIGEN_FAVICON_ASSET } from "./lib/brand";

const SITE_URL = "https://www.origenliencres.com";
const title = "Origen Liencres | Retiros en el norte de España";
const description =
  "Retiros y experiencias de bienestar en Liencres, Cantabria, junto al océano y los bosques de Costa Quebrada. Un espacio para volver a la esencia.";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: "Origen Liencres",
      alternateName: "Origen",
      description,
      inLanguage: ["es-ES", "en"],
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Origen Liencres",
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}${ORIGEN_FAVICON_ASSET}`,
      sameAs: ["https://www.instagram.com/origen.liencres/"],
    },
    {
      "@type": "LodgingBusiness",
      "@id": `${SITE_URL}/#retreat-space`,
      name: "Origen Liencres",
      url: `${SITE_URL}/`,
      image: `${SITE_URL}/og.png`,
      description:
        "Espacio para retiros, residencias y experiencias de bienestar en Liencres, Cantabria, en el norte de España.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Liencres",
        addressRegion: "Cantabria",
        addressCountry: "ES",
      },
      areaServed: {
        "@type": "AdministrativeArea",
        name: "Norte de España",
      },
      amenityFeature: [
        {
          "@type": "LocationFeatureSpecification",
          name: "Sala de práctica de 80 m² abierta a la naturaleza",
          value: true,
        },
        {
          "@type": "LocationFeatureSpecification",
          name: "Cerca del océano y del bosque",
          value: true,
        },
        {
          "@type": "LocationFeatureSpecification",
          name: "Retiros íntimos para grupos pequeños",
          value: true,
        },
      ],
      parentOrganization: {
        "@id": `${SITE_URL}/#organization`,
      },
    },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const metadataBase = new URL(SITE_URL);
  const socialImage = new URL("/og.png", metadataBase).toString();

  return {
    metadataBase,
    title,
    description,
    applicationName: "Origen Liencres",
    category: "travel",
    keywords: [
      "retiros norte de España",
      "retiros en Cantabria",
      "retiros en Liencres",
      "espacio para retiros Cantabria",
      "retiro de bienestar España",
      "retiros Costa Quebrada",
      "residencia de bienestar Cantabria",
      "retiros junto al mar",
      "Origen Liencres",
    ],
    alternates: {
      canonical: "/",
      languages: {
        "es-ES": "/?lang=es",
        en: "/?lang=en",
        "x-default": "/",
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    icons: {
      icon: [
        {
          url: ORIGEN_FAVICON_ASSET,
          type: "image/png",
          sizes: "595x595",
        },
      ],
      shortcut: ORIGEN_FAVICON_ASSET,
      apple: ORIGEN_FAVICON_ASSET,
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: "/",
      siteName: "Origen Liencres",
      locale: "es_ES",
      alternateLocale: ["en_GB"],
      images: [{ url: socialImage, width: 1536, height: 1024, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
