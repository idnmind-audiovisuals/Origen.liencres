import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("publishes focused SEO crawl directives", async () => {
  const [robotsResponse, sitemapResponse] = await Promise.all([
    render("/robots.txt"),
    render("/sitemap.xml"),
  ]);

  assert.equal(robotsResponse.status, 200);
  assert.match(robotsResponse.headers.get("content-type") ?? "", /^text\/plain\b/i);
  const robots = await robotsResponse.text();
  assert.match(robots, /Sitemap: https:\/\/www\.origenliencres\.com\/sitemap\.xml/i);
  assert.match(robots, /Disallow: \/residency/i);

  assert.equal(sitemapResponse.status, 200);
  assert.match(sitemapResponse.headers.get("content-type") ?? "", /xml/i);
  const sitemap = await sitemapResponse.text();
  assert.match(sitemap, /https:\/\/www\.origenliencres\.com\//i);
  assert.match(sitemap, /hreflang="es-ES"/i);
});

test("server-renders the Origen gateway", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(
    html,
    /<title>Origen Liencres \| Retiros en el norte de España<\/title>/i,
  );
  assert.match(html, /Origen access gateway/i);
  assert.match(html, /origen-favicon\.png/i);
  assert.match(html, /rel="canonical" href="https:\/\/www\.origenliencres\.com\/"/i);
  assert.match(html, /application\/ld\+json/i);
  assert.match(html, /Espacio para retiros, residencias y experiencias de bienestar/i);
  assert.match(html, /Retiros en el norte de España/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("keeps all access keys server-only and destination-scoped", async () => {
  const [client, route, session, example, bros, invitation, editorial, instagram, experience, environment, sculpture, siteCopy, styles, robots, sitemap, brosPage, legacyBrosPage, residencyPage, spacePage, experiencePage] = await Promise.all([
    readFile(new URL("../app/components/AccessKeyForm.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/api/access/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/lib/access-session.ts", import.meta.url), "utf8"),
    readFile(new URL("../.env.example", import.meta.url), "utf8"),
    readFile(new URL("../app/components/BrosState.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/OpenedState.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/EditorialPage.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/InstagramLink.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/ExperienceState.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/ExperienceEnvironment.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/ExperienceSculpture.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/lib/site-copy.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/robots.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/sitemap.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/circulo-de-hombres/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/bros/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/residency/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/space/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/experience/page.tsx", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(client, /ORIGEN_(?:BROS_|SPACE_)?ACCESS_KEY|Esencia/i);
  assert.match(route, /matchAccessKey/);
  assert.match(route, /destination/);
  assert.match(session, /process\.env\.ORIGEN_ACCESS_KEY/);
  assert.match(session, /process\.env\.ORIGEN_BROS_ACCESS_KEY/);
  assert.match(session, /process\.env\.ORIGEN_SPACE_ACCESS_KEY/);
  assert.match(session, /process\.env\.ORIGEN_EXPERIENCE_ACCESS_KEY/);
  assert.doesNotMatch(session, /["'](?:Esencia|Bros|Espacio|Experiencia)["']/i);
  assert.equal(
    example,
    "ORIGEN_ACCESS_KEY=\nORIGEN_BROS_ACCESS_KEY=\nORIGEN_SPACE_ACCESS_KEY=\nORIGEN_EXPERIENCE_ACCESS_KEY=\n",
  );
  assert.match(
    bros,
    /https:\/\/docs\.google\.com\/forms\/d\/e\/1FAIpQLSd2uhreU_NDgC3-H9wOfcsP2w9Q_lixIq4Er_BsEMTTNB7W5g\/viewform["']/,
  );
  assert.match(bros, /https:\/\/chat\.whatsapp\.com\/F7Yg8F7zx1R3jA5ltgvKwS/);
  assert.match(bros, /Un espacio de autenticidad para hombres\./);
  assert.match(bros, />\s*UNIRME\s*</);
  assert.match(bros, /<strong>Solicitar acceso<\/strong>/);
  assert.match(
    invitation,
    /https:\/\/docs\.google\.com\/forms\/d\/e\/1FAIpQLScHDNpewNDGJQalw3Dvpz3hm2RzsIV1bdzRrpRHZ3ShApJJEA\/viewform\?usp=publish-editor["']/,
  );
  assert.match(
    invitation,
    /https:\/\/docs\.google\.com\/forms\/d\/e\/1FAIpQLSf9DrIbIV4OKiswKQhuKsssMyVvuP_l8CROR0ijH0_WUQSpIw\/viewform\?usp=publish-editor["']/,
  );
  assert.match(invitation, /href=\{applicationFormUrl\}[\s\S]*variant === "residency" \? "JOIN" : copy\.join/);
  assert.match(
    siteCopy,
    /export const RESIDENCY_COPY =[\s\S]*join: "JOIN"[\s\S]*export const SPACE_COPY =[\s\S]*join: "HOST"/,
  );
  assert.match(siteCopy, /A retreat space designed for deep connection/);
  assert.match(siteCopy, /A home for 8ppl retreats/);
  assert.match(siteCopy, /25 min from the airport/);
  assert.match(siteCopy, /2 nudist beaches walk distance/);
  assert.match(siteCopy, /A wide opened to nature practice shala/);
  assert.match(siteCopy, /View available dates on Airbnb/);
  assert.match(siteCopy, /availability: "Retreat space"/);
  assert.match(
    invitation,
    /isAvailabilityLink[\s\S]*href=\{SPACE_URL\}/,
  );
  assert.match(
    styles,
    /\.invitation-availability span \{[\s\S]*background: #68763d;/,
  );
  assert.match(
    invitation,
    /href=\{MAPS_URL\}[\s\S]*className="invitation-join"[\s\S]*localizedHref\("\/story"/,
  );
  assert.match(
    instagram,
    /https:\/\/www\.instagram\.com\/origen\.liencres\//,
  );
  assert.match(instagram, /site-instagram-icon/);
  assert.match(invitation, /<InstagramLink \/>/);
  assert.match(bros, /<InstagramLink \/>/);
  assert.match(editorial, /<InstagramLink \/>/);
  assert.match(experience, /import\("lenis"\)/);
  assert.match(experience, /import\("gsap"\)/);
  assert.match(experience, /import\("gsap\/ScrollTrigger"\)/);
  assert.match(experience, /ORIGEN_WORDMARK_ASSET/);
  assert.match(experience, /className="experience-source-wordmark"/);
  assert.match(styles, /\.experience-emblem-layer[\s\S]*origen-experience-ring-mask\.png/);
  assert.doesNotMatch(styles, /\.experience-emblem-core/);
  assert.match(styles, /\.experience-source-dot[\s\S]*background: #f2efe8/);
  assert.doesNotMatch(styles, /\.experience-emblem-layer[\s\S]{0,800}experience-rock\.webp/);
  assert.match(experience, /<ExperienceEnvironment variant="ocean"/);
  assert.match(experience, /<ExperienceEnvironment variant="rock"/);
  assert.match(experience, /<ExperienceEnvironment variant="forest"/);
  assert.match(environment, /experience-world-depth--far/);
  assert.match(environment, /experience-world-depth--near/);
  assert.match(environment, /experience-sea-stacks/);
  assert.match(environment, /experience-rock-strata/);
  assert.match(environment, /experience-forest-path/);
  assert.match(environment, /experience-forest-canopy/);
  assert.match(environment, /experience-forest-branches/);
  assert.match(sculpture, /experience-emblem-layer--back/);
  assert.match(sculpture, /experience-return-dot/);
  assert.doesNotMatch(sculpture, /experience-sculpture-(?:halo|ring|core)/);
  assert.doesNotMatch(styles, /experience-(?:atlantic|rock|coast|forest)\.webp/);
  assert.doesNotMatch(`${bros}${invitation}${experience}`, /↗/);
  assert.match(styles, /\.external-link-dot/);
  assert.match(robots, /sitemap\.xml/);
  assert.match(robots, /\/api\//);
  assert.match(sitemap, /https:\/\/www\.origenliencres\.com/);
  assert.match(sitemap, /"es-ES"/);
  assert.match(brosPage, /requireOrigenAccess\("bros"\)/);
  assert.match(legacyBrosPage, /redirect\("\/circulo-de-hombres"\)/);
  assert.match(residencyPage, /requireOrigenAccess\("residency"\)/);
  assert.match(spacePage, /requireOrigenAccess\("space"\)/);
  assert.match(experiencePage, /requireOrigenAccess\("experience"\)/);

  const packageJson = await readFile(new URL("package.json", templateRoot), "utf8");
  assert.match(packageJson, /framer-motion/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
