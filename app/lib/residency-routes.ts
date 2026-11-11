import type { Metadata } from "next";
import type { Language } from "./language";
import type { ResidencyFocus } from "./site-copy";

const SITE_URL = "https://www.origenliencres.com";

type ResidencyRouteCopy = {
  slug: string;
  title: string;
  description: string;
  serviceName: string;
  audience: string;
};

type ResidencyRoute = Record<Language, ResidencyRouteCopy>;

export const RESIDENCY_ROUTES: Record<ResidencyFocus, ResidencyRoute> = {
  artistic: {
    es: {
      slug: "residencias-artisticas-cantabria",
      title: "Residencias artísticas en Cantabria | Origen Liencres",
      description:
        "Espacio para organizadores de residencias artísticas en Cantabria: alojamiento privado, shala y naturaleza para grupos creativos de hasta 8 personas.",
      serviceName: "Espacio para organizar residencias artísticas en Cantabria",
      audience: "Comisarios, facilitadores y organizadores de residencias creativas",
    },
    en: {
      slug: "artist-residencies-cantabria",
      title: "Artist Residencies in Cantabria | Origen Liencres",
      description:
        "A private venue for artist residency organisers in Cantabria, with accommodation, a shala and nature for creative groups of up to 8 people.",
      serviceName: "Venue for organising artist residencies in Cantabria",
      audience: "Curators, facilitators and creative residency organisers",
    },
  },
  coworking: {
    es: {
      slug: "residencias-coworking-cantabria",
      title: "Residencias coworking en Cantabria | Origen Liencres",
      description:
        "Espacio para organizar residencias de coworking y coliving en Cantabria para comunidades, equipos y grupos remotos de hasta 8 personas.",
      serviceName: "Espacio para organizar residencias coworking en Cantabria",
      audience: "Responsables de comunidad, equipos y organizadores de coworking",
    },
    en: {
      slug: "coworking-residencies-cantabria",
      title: "Coworking Residencies in Cantabria | Origen Liencres",
      description:
        "A venue for organisers hosting coworking and coliving residencies in Cantabria for remote communities and teams of up to 8 people.",
      serviceName: "Venue for organising coworking residencies in Cantabria",
      audience: "Community leads, team leads and coworking organisers",
    },
  },
  entrepreneur: {
    es: {
      slug: "residencias-emprendedoras-cantabria",
      title: "Residencias emprendedoras en Cantabria | Origen Liencres",
      description:
        "Espacio para organizadores de residencias emprendedoras, aceleradoras y masterminds en Cantabria para grupos de hasta 8 personas.",
      serviceName: "Espacio para organizar residencias emprendedoras en Cantabria",
      audience: "Responsables de aceleradoras, mentores y organizadores de comunidades",
    },
    en: {
      slug: "entrepreneur-residencies-cantabria",
      title: "Entrepreneur Residencies in Cantabria | Origen Liencres",
      description:
        "A venue for organisers hosting founder residencies, accelerators and masterminds in Cantabria for groups of up to 8 people.",
      serviceName: "Venue for organising entrepreneur residencies in Cantabria",
      audience: "Accelerator leads, mentors and founder-community organisers",
    },
  },
};

export function getResidencyLanguageHrefs(focus: ResidencyFocus) {
  return {
    es: `/${RESIDENCY_ROUTES[focus].es.slug}`,
    en: `/${RESIDENCY_ROUTES[focus].en.slug}`,
  } satisfies Record<Language, string>;
}

export function getResidencyMetadata(
  focus: ResidencyFocus,
  language: Language,
): Metadata {
  const page = RESIDENCY_ROUTES[focus][language];
  const hrefs = getResidencyLanguageHrefs(focus);
  const url = `${SITE_URL}/${page.slug}`;

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: `/${page.slug}`,
      languages: {
        "es-ES": hrefs.es,
        en: hrefs.en,
        "x-default": hrefs.es,
      },
    },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      url,
      title: page.title,
      description: page.description,
      siteName: "Origen Liencres",
      locale: language === "es" ? "es_ES" : "en_GB",
      alternateLocale: [language === "es" ? "en_GB" : "es_ES"],
      images: [
        {
          url: "/og.png",
          width: 1536,
          height: 1024,
          alt: page.serviceName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: ["/og.png"],
    },
  };
}

export function getResidencyStructuredData(
  focus: ResidencyFocus,
  language: Language,
) {
  const page = RESIDENCY_ROUTES[focus][language];
  const url = `${SITE_URL}/${page.slug}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: page.title,
        description: page.description,
        inLanguage: language === "es" ? "es-ES" : "en-GB",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${url}#service` },
      },
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: page.serviceName,
        serviceType: page.serviceName,
        description: page.description,
        url,
        provider: { "@id": `${SITE_URL}/#organization` },
        areaServed: { "@type": "AdministrativeArea", name: "Cantabria" },
        audience: { "@type": "Audience", audienceType: page.audience },
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
            name: page.serviceName,
            item: url,
          },
        ],
      },
    ],
  };
}
