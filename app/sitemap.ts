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
      url: `${SITE_URL}/retiros`,
      lastModified: new Date("2026-11-11T00:00:00+01:00"),
      changeFrequency: "monthly",
      priority: 0.95,
      alternates: {
        languages: {
          "es-ES": `${SITE_URL}/retiros`,
          en: `${SITE_URL}/retreats`,
          "x-default": `${SITE_URL}/retiros`,
        },
      },
    },
    {
      url: `${SITE_URL}/retreats`,
      lastModified: new Date("2026-11-11T00:00:00+01:00"),
      changeFrequency: "monthly",
      priority: 0.88,
      alternates: {
        languages: {
          "es-ES": `${SITE_URL}/retiros`,
          en: `${SITE_URL}/retreats`,
          "x-default": `${SITE_URL}/retiros`,
        },
      },
    },
    {
      url: `${SITE_URL}/residencias`,
      lastModified: new Date("2026-11-11T00:00:00+01:00"),
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: {
        languages: {
          "es-ES": `${SITE_URL}/residencias`,
          en: `${SITE_URL}/residencies`,
          "x-default": `${SITE_URL}/residencias`,
        },
      },
    },
    {
      url: `${SITE_URL}/residencies`,
      lastModified: new Date("2026-11-11T00:00:00+01:00"),
      changeFrequency: "monthly",
      priority: 0.85,
      alternates: {
        languages: {
          "es-ES": `${SITE_URL}/residencias`,
          en: `${SITE_URL}/residencies`,
          "x-default": `${SITE_URL}/residencias`,
        },
      },
    },
    ...([
      ["residencias-artisticas-cantabria", "artist-residencies-cantabria"],
      ["residencias-coworking-cantabria", "coworking-residencies-cantabria"],
      ["residencias-emprendedoras-cantabria", "entrepreneur-residencies-cantabria"],
    ] as const).flatMap(([spanishSlug, englishSlug]) => {
      const languages = {
        "es-ES": `${SITE_URL}/${spanishSlug}`,
        en: `${SITE_URL}/${englishSlug}`,
        "x-default": `${SITE_URL}/${spanishSlug}`,
      };
      return [
        {
          url: `${SITE_URL}/${spanishSlug}`,
          lastModified: new Date("2026-11-11T00:00:00+01:00"),
          changeFrequency: "monthly" as const,
          priority: 0.82,
          alternates: { languages },
        },
        {
          url: `${SITE_URL}/${englishSlug}`,
          lastModified: new Date("2026-11-11T00:00:00+01:00"),
          changeFrequency: "monthly" as const,
          priority: 0.78,
          alternates: { languages },
        },
      ];
    }),
    {
      url: `${SITE_URL}/eventos-bienestar-cantabria`,
      lastModified: new Date("2026-11-11T00:00:00+01:00"),
      changeFrequency: "monthly",
      priority: 0.82,
      alternates: {
        languages: {
          "es-ES": `${SITE_URL}/eventos-bienestar-cantabria`,
          en: `${SITE_URL}/wellness-events-cantabria`,
          "x-default": `${SITE_URL}/eventos-bienestar-cantabria`,
        },
      },
    },
    {
      url: `${SITE_URL}/wellness-events-cantabria`,
      lastModified: new Date("2026-11-11T00:00:00+01:00"),
      changeFrequency: "monthly",
      priority: 0.78,
      alternates: {
        languages: {
          "es-ES": `${SITE_URL}/eventos-bienestar-cantabria`,
          en: `${SITE_URL}/wellness-events-cantabria`,
          "x-default": `${SITE_URL}/eventos-bienestar-cantabria`,
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
