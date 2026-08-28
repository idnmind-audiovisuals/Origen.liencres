import type { MetadataRoute } from "next";

const SITE_URL = "https://www.origenliencres.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/bros",
        "/circulo-de-hombres",
        "/experience",
        "/residency",
        "/space",
        "/story",
        "/vision",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
