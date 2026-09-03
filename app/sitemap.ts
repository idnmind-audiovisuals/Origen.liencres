import type { MetadataRoute } from "next";
import { organizerLanguageAlternates, organizerSlugs } from "./lib/organizer-content";

const SITE_URL = "https://www.origenliencres.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-08-31T00:00:00+02:00");

  return [
    {
      url: `${SITE_URL}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
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
