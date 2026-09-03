import type { MetadataRoute } from "next";

const SITE_URL = "https://www.origenliencres.com";

const protectedRoutes = [
  "/api/",
  "/bros",
  "/circulo-de-hombres",
  "/experience",
  "/residency",
  "/retreat-organizers-circle",
  "/space",
  "/story",
  "/vision",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "OAI-SearchBot", allow: "/", disallow: protectedRoutes },
      { userAgent: "Googlebot", allow: "/", disallow: protectedRoutes },
      { userAgent: "Bingbot", allow: "/", disallow: protectedRoutes },
      { userAgent: "*", allow: "/", disallow: protectedRoutes },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
