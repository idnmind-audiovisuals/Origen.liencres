import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);

const organizerRoutes = [
  { slug: "retreat-venue-spain", language: "en", heading: "Retreat venue in Spain.", alternate: "espacio-retiros-cantabria" },
  { slug: "espacio-retiros-cantabria", language: "es", heading: "Tu retiro en Cantabria.", alternate: "retreat-venue-spain" },
  { slug: "creative-residency-spain", language: "en", heading: "Space for a creative residency." },
  { slug: "host-your-retreat", language: "en", heading: "Host your retreat in Cantabria.", alternate: "organizar-retiro" },
  { slug: "espacio-retiros", language: "es", heading: "Un espacio. Muchas formas de reunir." },
  { slug: "organizar-retiro", language: "es", heading: "Organiza tu retiro en Origen.", alternate: "host-your-retreat" },
];

const publicOrigin = "https://www.origenliencres.com";

function decodeHtml(value) {
  return value.replaceAll("&amp;", "&").replaceAll("&#x27;", "'").replaceAll("&quot;", '"');
}

function meta(html, name) {
  const match = html.match(new RegExp(`<meta (?:name|property)="${name}" content="([^"]*)"`));
  assert.ok(match, `Expected metadata field: ${name}`);
  return decodeHtml(match[1]);
}

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
  assert.match(robots, /User-Agent: OAI-SearchBot/i);
  assert.match(robots, /User-Agent: Googlebot/i);
  assert.match(robots, /User-Agent: Bingbot/i);

  assert.equal(sitemapResponse.status, 200);
  assert.match(sitemapResponse.headers.get("content-type") ?? "", /xml/i);
  const sitemap = await sitemapResponse.text();
  assert.match(sitemap, /https:\/\/www\.origenliencres\.com\//i);
  assert.match(sitemap, /\/retiros-cantabria/i);
  assert.match(sitemap, /\/retreats-spain/i);
  assert.match(sitemap, /\/host-your-retreat/i);
  assert.match(sitemap, /hreflang="es-ES"/i);
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
  assert.equal(new Set(urls).size, urls.length, "Sitemap must not repeat existing host route");
  for (const { slug } of organizerRoutes) {
    assert.ok(urls.includes(`${publicOrigin}/${slug}`), `Sitemap includes ${slug}`);
    assert.ok(!robots.includes(`Disallow: /${slug}`), `${slug} is crawlable`);
  }
});

test("publishes six distinct, public organiser pages in the URL's language", async () => {
  const titles = new Set();
  const descriptions = new Set();
  for (const route of organizerRoutes) {
    const response = await render(`/${route.slug}`);
    assert.equal(response.status, 200, route.slug);
    const html = await response.text();
    const url = `${publicOrigin}/${route.slug}`;
    assert.match(html, /<main class="retreat-public-page retreat-public-page--esencia organizer-page"/);
    assert.ok(html.includes(`lang="${route.language}"`));
    assert.ok(html.includes(`<h1 id="organizer-title">${route.heading}</h1>`));
    assert.equal([...html.matchAll(/<h1\b/g)].length, 1);
    assert.ok(html.includes(`rel="canonical" href="${url}"`));
    assert.match(meta(html, "robots"), /index, follow/);
    assert.doesNotMatch(meta(html, "robots"), /noindex|nofollow/);
    assert.doesNotMatch(html, /<figure\b|<canvas\b|type="password"/i);
    assert.match(html, /id="planning"/);
    assert.match(html, /href="#planning"/);
    assert.equal([...html.matchAll(/<details>/g)].length, 3);
    assert.match(html, /scroll-reveal-list/);
    assert.match(html, /href="https:\/\/docs\.google\.com\/forms\/d\/e\/1FAIpQLSf9DrIbIV4OKiswKQhuKsssMyVvuP_l8CROR0ijH0_WUQSpIw\/viewform\?usp=publish-editor" target="_blank" rel="noreferrer"/);
    const title = decodeHtml(html.match(/<title>(.*?)<\/title>/)[1]);
    titles.add(title);
    descriptions.add(meta(html, "description"));
    assert.equal(meta(html, "og:title"), title);
    assert.equal(meta(html, "twitter:title"), title);
    assert.equal(meta(html, "og:description"), meta(html, "description"));
    assert.equal(meta(html, "twitter:description"), meta(html, "description"));
    assert.equal(meta(html, "og:url"), url);
    assert.equal(meta(html, "og:locale"), route.language === "es" ? "es_ES" : "en_GB");
    assert.equal(meta(html, "og:image"), `${publicOrigin}/og.png`);
    if (route.alternate) {
      const altLang = route.language === "es" ? "en" : "es-ES";
      assert.ok(html.includes(`hrefLang="${altLang}" href="${publicOrigin}/${route.alternate}"`) || html.includes(`hreflang="${altLang}" href="${publicOrigin}/${route.alternate}"`));
      assert.ok(html.includes(`href="/${route.alternate}"`));
    } else {
      assert.doesNotMatch(html, /<link rel="alternate"[^>]*hreflang=/i, "Do not mark unrelated pages as translations");
    }
    const graphs = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((match) => JSON.parse(match[1]));
    const graph = graphs.find((data) => data["@graph"]?.some((item) => item["@id"] === `${url}#page`));
    assert.ok(graph, "Page-specific structured data is valid JSON");
    const webpage = graph["@graph"].find((item) => item["@type"] === "WebPage");
    assert.equal(webpage.inLanguage, route.language);
    assert.equal(webpage.name, title);
    assert.equal(webpage.about["@id"], `${publicOrigin}/#retreat-space`);
    const service = graph["@graph"].find((item) => item["@type"] === "Service");
    assert.equal(service.provider["@id"], `${publicOrigin}/#retreat-space`);
    assert.ok(graph["@graph"].some((item) => item["@type"] === "BreadcrumbList"));
    for (const related of organizerRoutes.filter((other) => other.language === route.language)) {
      assert.ok(html.includes(`href="/${related.slug}"`), `Related page ${related.slug} is reachable`);
    }
  }
  assert.equal(titles.size, organizerRoutes.length, "Every intent has a unique title");
  assert.equal(descriptions.size, organizerRoutes.length, "Every intent has a unique description");
});

test("connects the existing discovery pages to all organiser pages", async () => {
  for (const [path, language] of [["/retiros-cantabria", "es"], ["/retreats-spain", "en"]]) {
    const html = await (await render(path)).text();
    for (const { slug } of organizerRoutes.filter((route) => route.language === language)) {
      assert.ok(html.includes(`href="/${slug}"`), `${path} links to /${slug}`);
    }
    assert.match(html, /href="\/retreat-organizers-circle"/);
  }
});

test("publishes the monthly organisers' circle in the Bros style without a password", async () => {
  const response = await render("/retreat-organizers-circle");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<main class="bros-page hosts-circle-page" lang="en"/);
  assert.match(html, /invitation-texture bros-texture/);
  assert.match(html, /class="bros-brand"/);
  assert.match(html, /<h1 id="hosts-title"><span>Origen<\/span><span>Hosts<\/span><\/h1>/);
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1);
  assert.match(html, /First Tuesday of every month/);
  assert.match(html, /<time dateTime="17:00">5pm/);
  assert.match(html, /Europe\/Madrid/);
  assert.match(html, /daylight-saving changes/);
  assert.match(html, /A suggested (?:<!-- -->)?90(?:<!-- -->)?-minute structure/);
  const flowMinutes = [...html.matchAll(/class="hosts-step-duration">(\d+)(?:<!-- -->)? minutes/g)].map((match) => Number(match[1]));
  assert.equal(flowMinutes.length, 5);
  assert.equal(flowMinutes.reduce((total, minutes) => total + minutes, 0), 90);
  assert.match(html, /Confidentiality/);
  assert.match(html, /Listening before advice/);
  assert.match(html, /One win\./);
  assert.match(html, /One challenge\./);
  assert.match(html, /One offer\./);
  assert.match(html, /href="#join"/);
  assert.match(html, /id="join"/);
  assert.match(html, /href="https:\/\/www\.instagram\.com\/origen\.liencres\/" target="_blank" rel="noreferrer"/);
  assert.match(html, /Opening Instagram does not register you/);
  assert.doesNotMatch(html, /type="password"|forms\.gle|docs\.google\.com\/forms|chat\.whatsapp\.com|zoom\.us/);
  assert.equal(meta(html, "og:url"), `${publicOrigin}/retreat-organizers-circle`);
  assert.equal(meta(html, "og:title"), "Retreat Organisers Circle — Origen Hosts");
  assert.equal(meta(html, "twitter:title"), meta(html, "og:title"));
  assert.match(html, /rel="canonical" href="https:\/\/www\.origenliencres\.com\/retreat-organizers-circle"/);
  assert.match(html, /"audienceType":"Retreat venue owners and organisers"/);
  assert.doesNotMatch(meta(html, "robots"), /noindex/);
  const sitemap = await (await render("/sitemap.xml")).text();
  assert.match(sitemap, /<loc>https:\/\/www\.origenliencres\.com\/retreat-organizers-circle<\/loc>/);
});

test("keeps the existing private destinations behind the gateway", async () => {
  for (const path of ["/space", "/experience", "/residency", "/circulo-de-hombres"]) {
    const response = await render(path);
    assert.equal(response.status, 307, `${path} requires an access session`);
    assert.equal(new URL(response.headers.get("location"), "http://localhost").href, "http://localhost/");
  }
});

test("uses a black wordmark with a white inner O on every light-page header", async () => {
  const styles = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  const filterRule = styles.match(/\.invitation-brand img,\s*\.editorial-brand img,\s*\.retreat-public-brand img\s*\{([^}]+)\}/);
  assert.ok(filterRule, "Invitations, editorial and public pages share the same light logo");
  assert.match(filterRule[1], /filter: grayscale\(1\) invert\(1\) contrast\(2\);/);
  assert.doesNotMatch(filterRule[1], /transform:|background:/, "No resizing or background is added to the logo");
  assert.doesNotMatch(styles, /\.retreat-public-page--esencia \.retreat-public-brand img\s*\{/, "No route-specific override can restore the white lettering");
  for (const selector of ["invitation-brand", "editorial-brand", "retreat-public-brand"]) {
    const standaloneRule = [...styles.matchAll(new RegExp(`\\.${selector} img \\{([^}]+)\\}`, "g"))].at(-1);
    assert.ok(standaloneRule);
    assert.match(standaloneRule[1], /width: 100%;/);
    assert.match(standaloneRule[1], /height: auto;/);
    assert.doesNotMatch(standaloneRule[1], /filter:/, `${selector} keeps the shared palette`);
  }
  const experienceRule = styles.match(/\.experience-brand img\s*\{([^}]+)\}/);
  assert.ok(experienceRule);
  assert.doesNotMatch(experienceRule[1], /filter:/, "The dark experience header is unchanged");
});

test("publishes indexable Spanish and English retreat pages", async () => {
  const [spanishResponse, englishResponse, spanishFaqResponse, englishFaqResponse, hostResponse] =
    await Promise.all([
      render("/retiros-cantabria"),
      render("/retreats-spain"),
      render("/retiros-cantabria/preguntas-frecuentes"),
      render("/retreats-spain/faq"),
      render("/host-your-retreat"),
    ]);

  for (const response of [spanishResponse, englishResponse, spanishFaqResponse, englishFaqResponse, hostResponse]) {
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  }

  const [spanish, english, spanishFaq, englishFaq, host] = await Promise.all([
    spanishResponse.text(),
    englishResponse.text(),
    spanishFaqResponse.text(),
    englishFaqResponse.text(),
    hostResponse.text(),
  ]);

  assert.match(spanish, /Espacio para retiros en Cantabria/i);
  assert.match(spanish, /Origen es un espacio para organizar retiros en Cantabria/i);
  assert.match(spanish, /Organiza tu retiro/i);
  assert.doesNotMatch(spanish, /Host your retreat/i);
  assert.match(spanish, />Organizar</i);
  assert.match(
    spanish,
    /https:\/\/docs\.google\.com\/forms\/d\/e\/1FAIpQLSf9DrIbIV4OKiswKQhuKsssMyVvuP_l8CROR0ijH0_WUQSpIw\/viewform\?usp=publish-editor/i,
  );
  assert.match(spanish, />Google Maps</i);
  assert.match(spanish, />Preguntas frecuentes</i);
  assert.match(spanish, /retreat-public-page--esencia/i);
  assert.doesNotMatch(spanish, /<figure\b/i);
  assert.match(spanish, /rel="canonical" href="https:\/\/www\.origenliencres\.com\/retiros-cantabria"/i);
  assert.match(spanish, /hreflang="en" href="https:\/\/www\.origenliencres\.com\/retreats-spain"/i);
  assert.match(english, /Retreat Venue in Northern Spain/i);
  assert.match(english, /small coastal retreat venue in Spain/i);
  assert.match(english, /Planning your retreat/i);
  assert.match(spanish, /Cómo organizar tu retiro/i);
  assert.match(spanishFaq, /¿Dónde puedo organizar un retiro cerca de Santander\?/i);
  assert.match(spanishFaq, /"@type":"FAQPage"/i);
  assert.match(englishFaq, /Where can I host a retreat near Santander\?/i);
  assert.match(englishFaq, /"@type":"FAQPage"/i);
  assert.match(host, /Host your retreat in Cantabria/i);
  assert.match(host, /Private retreat venue hire at Origen Liencres/i);
});

test("server-renders the Origen gateway", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(
    html,
    /<title>Origen Liencres \| Espacio para retiros en Cantabria<\/title>/i,
  );
  assert.match(html, /Espacio para residencias y retiros en Cantabria/i);
  assert.match(html, /La casa reúne naturaleza, playa y bosque para retiros íntimos y residencias creativas/i);
  assert.doesNotMatch(html, /Conocer el espacio/i);
  assert.match(html, /origen-favicon\.png/i);
  assert.match(html, /rel="canonical" href="https:\/\/www\.origenliencres\.com\/"/i);
  assert.match(html, /application\/ld\+json/i);
  assert.match(html, /Alojamiento turístico y espacio privado para organizar retiros/i);
  assert.match(html, /"latitude":43\.4571267/i);
  assert.match(html, /"telephone":"\+34622181691"/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("keeps all access keys server-only and destination-scoped", async () => {
  const [client, gateway, route, session, example, bros, invitation, editorial, instagram, experience, environment, sculpture, siteCopy, styles, robots, sitemap, brosPage, legacyBrosPage, residencyPage, spacePage, experiencePage] = await Promise.all([
    readFile(new URL("../app/components/AccessKeyForm.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/AccessGateway.tsx", import.meta.url), "utf8"),
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
  assert.match(gateway, /href="https:\/\/www\.origenliencres\.com\/retiros-cantabria"/);
  assert.match(gateway, /Retiros Cantabria/);
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
  assert.match(invitation, /scroll-reveal/);
  assert.match(editorial, /scroll-reveal-list/);
  assert.match(styles, /@keyframes origen-scroll-reveal/);
  assert.match(bros, /Nos reunimos regularmente cada semana/);
  assert.match(bros, /confirma en el group/);
  assert.doesNotMatch(bros, /Cada dos semanas/);
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
