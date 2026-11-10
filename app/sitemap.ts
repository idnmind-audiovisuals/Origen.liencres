import type { MetadataRoute } from "next";
import { organizerLanguageAlternates, organizerSlugs } from "./lib/organizer-content";

const SITE_URL = "https://www.origenliencres.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-08-31T00:00:00+02:00");

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date("2026-11-09T00:00:00+01:00"),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/circulo-de-hombres-cantabria`,
      lastModified: new Date("2026-11-09T00:00:00+01:00"),
      changeFrequency: "weekly",
      priority: 0.82,
    },
    {
      url: `${SITE_URL}/circulo-de-mujeres-cantabria`,
      lastModified: new Date("2026-11-09T00:00:00+01:00"),
      changeFrequency: "weekly",
      priority: 0.82,
    },
    {
      url: `${SITE_URL}/residencia`,
      lastModified: new Date("2026-11-09T00:00:00+01:00"),
      changeFrequency: "monthly",
      priority: 0.82,
    },
    {
      url: `${SITE_URL}/eventos-bienestar-cantabria`,
      lastModified: new Date("2026-11-09T00:00:00+01:00"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/retiros-cantabria`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
      alternates: {
        languages: {
          "es-ES": `${SITE_URL}/retiros-cantabria`,
          en: `${SITE_URL}/retreats-spain`,
          "x-default": `${SITE_URL}/retiros-cantabria`,
        },
      },
    },
    {
      url: `${SITE_URL}/retreats-spain`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: {
        languages: {
          "es-ES": `${SITE_URL}/retiros-cantabria`,
          en: `${SITE_URL}/retreats-spain`,
          "x-default": `${SITE_URL}/retiros-cantabria`,
        },
      },
    },
    {
      url: `${SITE_URL}/retiros-cantabria/preguntas-frecuentes`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.82,
      alternates: {
        languages: {
          "es-ES": `${SITE_URL}/retiros-cantabria/preguntas-frecuentes`,
          en: `${SITE_URL}/retreats-spain/faq`,
        },
      },
    },
    {
      url: `${SITE_URL}/retreats-spain/faq`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.78,
      alternates: {
        languages: {
          "es-ES": `${SITE_URL}/retiros-cantabria/preguntas-frecuentes`,
          en: `${SITE_URL}/retreats-spain/faq`,
        },
      },
    },
    {
      url: `${SITE_URL}/retiros-en-cantabria`,
      lastModified: new Date("2026-09-19T00:00:00+02:00"),
      changeFrequency: "weekly",
      priority: 0.95,
      alternates: {
        languages: {
          "es-ES": `${SITE_URL}/retiros-en-cantabria`,
          en: `${SITE_URL}/host-your-retreat`,
          "x-default": `${SITE_URL}/retiros-en-cantabria`,
        },
      },
    },
    ...organizerSlugs.map((slug): MetadataRoute.Sitemap[number] => {
      const languages = organizerLanguageAlternates(slug);
      return {
        url: `${SITE_URL}/${slug}`,
        lastModified: new Date("2026-09-03T00:00:00+02:00"),
        changeFrequency: "monthly",
        priority: 0.8,
        ...(languages ? { alternates: { languages } } : {}),
      };
    }),
  ];
}
