import type { Metadata } from "next";
import "@fontsource-variable/montserrat";
import "./globals.css";
import { ORIGEN_FAVICON_ASSET } from "./lib/brand";
import {
  ORIGEN_INSTAGRAM_URL,
  ORIGEN_MAPS_URL,
  PUBLIC_SITE_URL,
} from "./lib/public-retreat-content";

const SITE_URL = PUBLIC_SITE_URL;
const title = "Origen Liencres | Espacio para retiros en Cantabria";
const description =
  "Alojamiento turístico y espacio para retiros, residencias y grupos privados en Liencres, Cantabria, entre la costa, las playas y el bosque.";

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
      telephone: "+34622181691",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Barrio Liencres, 585",
        postalCode: "39120",
        addressLocality: "Liencres",
        addressRegion: "Cantabria",
        addressCountry: "ES",
      },
      sameAs: [ORIGEN_MAPS_URL, ORIGEN_INSTAGRAM_URL],
    },
    {
      "@type": ["LodgingBusiness", "LocalBusiness"],
      "@id": `${SITE_URL}/#retreat-space`,
      name: "Origen Liencres",
      url: `${SITE_URL}/retiros-cantabria`,
      image: [
        `${SITE_URL}/og.png`,
        `${SITE_URL}/experience-coast.webp`,
        `${SITE_URL}/experience-forest.webp`,
      ],
      description:
        "Alojamiento turístico y espacio privado para organizar retiros, residencias creativas y experiencias de embodiment en Liencres, Cantabria, cerca de Santander, las playas, el mar y el bosque de Costa Quebrada.",
      telephone: "+34622181691",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Barrio Liencres, 585",
        postalCode: "39120",
        addressLocality: "Liencres",
        addressRegion: "Cantabria",
        addressCountry: "ES",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 43.4571267,
        longitude: -3.9472047,
      },
      hasMap: ORIGEN_MAPS_URL,
      sameAs: [ORIGEN_MAPS_URL, ORIGEN_INSTAGRAM_URL],
      maximumAttendeeCapacity: 8,
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
      makesOffer: {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Alquiler privado de espacio para retiros",
          serviceType: "Retreat venue hire",
        },
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
      "alojamiento para retiros Cantabria",
      "organizar retiro Cantabria",
      "retiros cerca de Santander",
      "retreat venue Northern Spain",
      "retreat venue near Santander",
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
    verification: {
      google: "WpjJXx8VxwnC-rTiTjIE9Xn6ApkUet-3bI5YyU23RME",
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
