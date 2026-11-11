import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { calculateRetreatQuote } from "../app/lib/retreat-pricing.ts";

const templateRoot = new URL("../", import.meta.url);

const genericOrganizerRoutes = [
  { slug: "organiza-tu-retiro-cantabria", language: "es", heading: "Organiza tu retiro en Origen.", alternate: "host-your-retreat-cantabria" },
  { slug: "host-your-retreat-cantabria", language: "en", heading: "Host your retreat in Cantabria.", alternate: "organiza-tu-retiro-cantabria" },
];

const organizerRoutes = [
  ...genericOrganizerRoutes,
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

async function requestWorker(pathname = "/", init = {}) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      ...init,
      headers: { accept: "text/html", ...(init.headers ?? {}) },
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

async function render(pathname = "/") {
  return requestWorker(pathname);
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
  assert.doesNotMatch(robots, /Disallow: \/(?:residencia|circulo-de-hombres-cantabria)/i);
  assert.match(robots, /User-Agent: OAI-SearchBot/i);
  assert.match(robots, /User-Agent: Googlebot/i);
  assert.match(robots, /User-Agent: Bingbot/i);

  assert.equal(sitemapResponse.status, 200);
  assert.match(sitemapResponse.headers.get("content-type") ?? "", /xml/i);
  const sitemap = await sitemapResponse.text();
  assert.match(sitemap, /https:\/\/www\.origenliencres\.com\//i);
  assert.match(sitemap, /\/organiza-tu-retiro-cantabria/i);
  assert.match(sitemap, /\/host-your-retreat-cantabria/i);
  assert.match(sitemap, /<loc>https:\/\/www\.origenliencres\.com\/retiros<\/loc>/i);
  assert.match(sitemap, /<loc>https:\/\/www\.origenliencres\.com\/retreats<\/loc>/i);
  assert.match(sitemap, /\/circulo-de-hombres-cantabria/i);
  assert.match(sitemap, /\/circulo-de-mujeres-cantabria/i);
  for (const residencyPath of [
    "/residencias",
    "/residencies",
    "/residencias-artisticas-cantabria",
    "/artist-residencies-cantabria",
    "/residencias-coworking-cantabria",
    "/coworking-residencies-cantabria",
    "/residencias-emprendedoras-cantabria",
    "/entrepreneur-residencies-cantabria",
  ]) {
    assert.match(sitemap, new RegExp(residencyPath));
  }
  assert.match(sitemap, /\/eventos-bienestar-cantabria/i);
  assert.match(sitemap, /\/wellness-events-cantabria/i);
  assert.doesNotMatch(sitemap, /<loc>https:\/\/www\.origenliencres\.com\/(?:retiro|residencia|residency|eventos|circulo-de-hombres|circulo-de-mujeres)<\/loc>/i);
  assert.doesNotMatch(sitemap, /<loc>https:\/\/www\.origenliencres\.com\/organizar-retiro<\/loc>/i);
  assert.match(sitemap, /hreflang="es-ES"/i);
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
  assert.equal(new Set(urls).size, urls.length, "Sitemap must not repeat existing host route");
  for (const { slug } of organizerRoutes) {
    assert.ok(urls.includes(`${publicOrigin}/${slug}`), `Sitemap includes ${slug}`);
    assert.ok(!robots.includes(`Disallow: /${slug}`), `${slug} is crawlable`);
  }
});

test("publishes one canonical organiser retreat page in each language", async () => {
  const titles = new Set();
  const descriptions = new Set();
  for (const route of genericOrganizerRoutes) {
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
    for (const related of genericOrganizerRoutes.filter((other) => other.language === route.language)) {
      assert.ok(html.includes(`href="/${related.slug}"`), `Related page ${related.slug} is reachable`);
    }
  }
  assert.equal(titles.size, genericOrganizerRoutes.length, "Every language has a unique title");
  assert.equal(descriptions.size, genericOrganizerRoutes.length, "Every language has a unique description");
});

test("presents the retreat venue explicitly to organisers", async () => {
  const response = await render("/organiza-tu-retiro-cantabria");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();

  assert.match(html, /<main class="retreat-public-page retreat-public-page--esencia organizer-page" lang="es">/);
  assert.match(html, /<h1 id="organizer-title">Organiza tu retiro en Origen\.<\/h1>/);
  assert.match(html, /Esta guía es para facilitadores/);
  assert.match(html, /Tu grupo · tu programa/i);
  assert.match(html, /El primer paso es una consulta, no una reserva inmediata/);
  assert.match(html, /Hasta 8 personas alojadas/);
  assert.match(html, /id="planning"/);
  assert.match(html, /id="host"/);
  assert.match(html, /Enviar propuesta|Organiza tu retiro/);
  assert.doesNotMatch(html, /Precio de lanzamiento|booking-date-trigger|Comprar plaza/i);
  assert.match(html, /rel="canonical" href="https:\/\/www\.origenliencres\.com\/organiza-tu-retiro-cantabria"/);
  assert.ok(html.includes(`hrefLang="en" href="${publicOrigin}/host-your-retreat-cantabria"`) || html.includes(`hreflang="en" href="${publicOrigin}/host-your-retreat-cantabria"`));
  assert.match(meta(html, "robots"), /index, follow/);
  assert.equal(meta(html, "og:url"), `${publicOrigin}/organiza-tu-retiro-cantabria`);
  assert.match(html, /"@type":"Service"/);
});

test("quotes the same length discounts and peak-season surcharge shown at checkout", () => {
  const regularBookingDate = new Date("2026-11-01T12:00:00Z");
  assert.equal(calculateRetreatQuote("2027-05-01", "2027-05-02", regularBookingDate)?.totalCents, 39_000);
  assert.equal(calculateRetreatQuote("2027-05-01", "2027-05-02", regularBookingDate)?.depositCents, 10_000);
  assert.equal(calculateRetreatQuote("2027-05-01", "2027-05-04", regularBookingDate)?.totalCents, 93_600);
  assert.equal(calculateRetreatQuote("2027-05-01", "2027-05-04", regularBookingDate)?.depositCents, 30_000);
  assert.equal(calculateRetreatQuote("2027-05-01", "2027-05-04", regularBookingDate)?.balanceDueCents, 63_600);
  assert.equal(calculateRetreatQuote("2027-05-01", "2027-05-08", regularBookingDate)?.totalCents, 191_100);
  assert.equal(calculateRetreatQuote("2027-05-01", "2027-05-08", regularBookingDate)?.depositCents, 70_000);
  assert.equal(calculateRetreatQuote("2027-07-01", "2027-07-02", regularBookingDate)?.totalCents, 50_700);
  assert.equal(calculateRetreatQuote("2027-07-01", "2027-07-04", regularBookingDate)?.totalCents, 121_680);
  assert.equal(calculateRetreatQuote("2027-12-20", "2027-12-21", regularBookingDate)?.totalCents, 50_700);
  assert.equal(calculateRetreatQuote("2027-06-30", "2027-07-02", regularBookingDate)?.highSeasonNights, 1);
  assert.equal(calculateRetreatQuote("2027-02-30", "2027-03-03", regularBookingDate), null);

  const octoberBookingDate = new Date("2026-10-15T12:00:00Z");
  const launchQuote = calculateRetreatQuote("2027-05-01", "2027-05-02", octoberBookingDate);
  assert.equal(launchQuote?.discountSource, "launch");
  assert.equal(launchQuote?.discountPercent, 30);
  assert.equal(launchQuote?.discountCents, 11_700);
  assert.equal(launchQuote?.totalCents, 27_300);
});

test("keeps Airbnb and Stripe credentials server-side and degrades safely before configuration", async () => {
  const response = await render("/api/availability");
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { configured: false, unavailable: [] });
  const subscriptionResponse = await requestWorker("/api/stripe/checkout", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ kind: "bros_monthly" }),
  });
  assert.equal(subscriptionResponse.status, 503);
  const tooManyGuestsResponse = await requestWorker("/api/stripe/checkout", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ kind: "retreat_full", arrival: "2030-05-01", departure: "2030-05-02", guests: 10 }),
  });
  assert.equal(tooManyGuestsResponse.status, 400);
  const nineGuestsResponse = await requestWorker("/api/stripe/checkout", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ kind: "retreat_full", arrival: "2030-05-01", departure: "2030-05-02", guests: 9 }),
  });
  assert.equal(nineGuestsResponse.status, 503);

  const [route, calendar, client, stripeRoute, stripeButton] = await Promise.all([
    readFile(new URL("../app/api/availability/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/lib/airbnb-calendar.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/BookingCalendar.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/api/stripe/checkout/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/StripeCheckoutButton.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(route, /loadAirbnbAvailability/);
  assert.match(route, /loadAirbnbAvailability\(\{ fresh: true \}\)/);
  assert.match(route, /"Cache-Control": "no-store"/);
  assert.match(calendar, /process\.env\.AIRBNB_ICAL_URL/);
  assert.doesNotMatch(client, /AIRBNB_ICAL_URL/);
  assert.match(client, /https:\/\/revolut\.me\/mariogonzalezdia/);
  assert.match(client, /Pagar estancia en Revolut/);
  assert.match(client, /Enviar anticipo · \$\{formatEuros\(quote\.depositCents\)\}/);
  assert.match(client, /El anticipo es de \{RETREAT_DEPOSIT_PER_NIGHT_EUR\} € por noche/);
  assert.match(client, /He confirmado con Origen las fechas/);
  assert.doesNotMatch(client, /StripeCheckoutButton|StripePaymentStatus/);
  assert.match(calendar, /revalidate: 10_800/);
  assert.match(stripeRoute, /process\.env\.STRIPE_SECRET_KEY/);
  assert.match(stripeRoute, /price_data\]\[unit_amount/);
  assert.match(stripeRoute, /quote\.balanceDueCents/);
  assert.match(stripeRoute, /RETREAT_DEPOSIT_PER_NIGHT_EUR \* 100/);
  assert.match(stripeRoute, /body\.kind === "retreat_full" \? 1 : nights/);
  assert.match(stripeRoute, /\"line_items\[0\]\[price_data\]\[unit_amount\]\": \"10000\"/);
  assert.match(stripeRoute, /\"line_items\[0\]\[price_data\]\[recurring\]\[interval\]\": \"month\"/);
  assert.match(stripeRoute, /loadAirbnbAvailability\(\{ fresh: true \}\)/);
  assert.match(stripeRoute, /daysUntilArrival < 30/);
  assert.match(stripeRoute, /rangeTouchesUnavailable/);
  assert.doesNotMatch(stripeButton, /STRIPE_SECRET_KEY|price_[A-Za-z0-9]/);
  const invalidSession = await requestWorker("/api/stripe/session?id=invalid");
  assert.equal(invalidSession.status, 400);
});

test("connects the residency hubs to every organiser-focused subpage", async () => {
  for (const [path, language] of [["/residencias", "es"], ["/residencies", "en"]]) {
    const response = await render(path);
    assert.equal(response.status, 200);
    const html = await response.text();
    for (const residencyPath of language === "es"
      ? ["residencias-artisticas-cantabria", "residencias-coworking-cantabria", "residencias-emprendedoras-cantabria"]
      : ["artist-residencies-cantabria", "coworking-residencies-cantabria", "entrepreneur-residencies-cantabria"]) {
      assert.ok(html.includes(`href="/${residencyPath}"`), `${path} links to /${residencyPath}`);
    }
    assert.match(html, language === "es" ? /quienes organizan/i : /for organisers/i);
    assert.doesNotMatch(html, /href="\/retreat-organizers-circle"/);
  }
});

test("keeps the monthly organisers' circle out of public discovery", async () => {
  const sitemap = await (await render("/sitemap.xml")).text();
  const robots = await (await render("/robots.txt")).text();
  assert.doesNotMatch(sitemap, /retreat-organizers-circle/);
  assert.match(robots, /Disallow: \/retreat-organizers-circle/);
});

test("publishes the home menu destinations while keeping specialist pages private", async () => {
  for (const path of [
    "/",
    "/circulo-de-hombres-cantabria",
    "/circulo-de-mujeres-cantabria",
    "/residencias",
    "/residencies",
    "/residencias-artisticas-cantabria",
    "/artist-residencies-cantabria",
    "/residencias-coworking-cantabria",
    "/coworking-residencies-cantabria",
    "/residencias-emprendedoras-cantabria",
    "/entrepreneur-residencies-cantabria",
    "/retiros",
    "/retreats",
    "/organiza-tu-retiro-cantabria",
    "/host-your-retreat-cantabria",
    "/eventos-bienestar-cantabria",
    "/wellness-events-cantabria",
  ]) {
    const response = await render(path);
    assert.equal(response.status, 200, `${path} is public`);
  }
  for (const path of ["/space", "/experience", "/retirobros", "/retreat-organizers-circle", "/retreat-organizers-circle?lang=es", "/retreat-organizers-circle?lang=en"]) {
    const response = await render(path);
    assert.equal(response.status, 307, `${path} requires an access session`);
    assert.equal(new URL(response.headers.get("location"), "http://localhost").href, "http://localhost/");
  }
});

test("publishes three distinct residency intents in Spanish and English", async () => {
  for (const [spanishPath, englishPath, spanishHeading, englishHeading] of [
    ["/residencias-artisticas-cantabria", "/artist-residencies-cantabria", "Residencias", "Artistic"],
    ["/residencias-coworking-cantabria", "/coworking-residencies-cantabria", "Coworking", "Coworking"],
    ["/residencias-emprendedoras-cantabria", "/entrepreneur-residencies-cantabria", "Emprendedoras", "Entrepreneur"],
  ]) {
    const [spanishResponse, englishResponse] = await Promise.all([
      render(spanishPath),
      render(englishPath),
    ]);
    assert.equal(spanishResponse.status, 200, spanishPath);
    assert.equal(englishResponse.status, 200, englishPath);
    const [spanish, english] = await Promise.all([
      spanishResponse.text(),
      englishResponse.text(),
    ]);
    assert.match(spanish, new RegExp(spanishHeading, "i"));
    assert.match(english, new RegExp(englishHeading, "i"));
    assert.match(spanish, new RegExp(`rel="canonical" href="${publicOrigin}${spanishPath}"`));
    assert.match(english, new RegExp(`rel="canonical" href="${publicOrigin}${englishPath}"`));
    assert.ok(spanish.includes(`hrefLang="en" href="${publicOrigin}${englishPath}"`) || spanish.includes(`hreflang="en" href="${publicOrigin}${englishPath}"`));
    assert.ok(english.includes(`hrefLang="es-ES" href="${publicOrigin}${spanishPath}"`) || english.includes(`hreflang="es-ES" href="${publicOrigin}${spanishPath}"`));
    assert.match(spanish, /"@type":"Service"/);
    assert.match(english, /"@type":"Service"/);
    assert.match(spanish, /organizadores|organizas|quien organiza/i);
    assert.match(english, /organisers|organizers|you organise/i);
    assert.match(spanish, /Tu grupo · tu programa|Tu grupo · tu ritmo/i);
    assert.match(english, /Your group · your programme|Your cohort · your rhythm|Your cohort · your programme/i);
    assert.match(spanish, /1FAIpQLSf9DrIbIV4OKiswKQhuKsssMyVvuP_l8CROR0ijH0_WUQSpIw/);
  }
});

test("publishes a search-focused retreat centre page and English counterpart", async () => {
  const [spanishResponse, englishResponse] = await Promise.all([
    render("/retiros"),
    render("/retreats"),
  ]);
  assert.equal(spanishResponse.status, 200);
  assert.equal(englishResponse.status, 200);
  const [spanish, english] = await Promise.all([
    spanishResponse.text(),
    englishResponse.text(),
  ]);

  assert.match(spanish, /<h1 id="retreat-public-title">Centro y espacio para retiros en Cantabria<\/h1>/i);
  assert.match(meta(spanish, "description"), /centro y espacio privado para organizar retiros en Cantabria/i);
  assert.match(spanish, /facilitadores y organizadores que traen su propio grupo y programa/i);
  assert.match(spanish, /rel="canonical" href="https:\/\/www\.origenliencres\.com\/retiros"/i);
  assert.ok(spanish.includes(`hrefLang="en" href="${publicOrigin}/retreats"`) || spanish.includes(`hreflang="en" href="${publicOrigin}/retreats"`));
  assert.match(spanish, /href="\/organiza-tu-retiro-cantabria"/i);
  assert.match(spanish, /"@type":"Service"/);
  assert.match(spanish, /"audienceType":"Facilitadores y organizadores de retiros"/);

  assert.match(english, /<h1 id="retreat-public-title">Retreat Venue in Northern Spain<\/h1>/i);
  assert.match(english, /organisers bringing their own group and programme/i);
  assert.match(english, /rel="canonical" href="https:\/\/www\.origenliencres\.com\/retreats"/i);
  assert.ok(english.includes(`hrefLang="es-ES" href="${publicOrigin}/retiros"`) || english.includes(`hreflang="es-ES" href="${publicOrigin}/retiros"`));
  assert.match(english, /href="\/host-your-retreat-cantabria"/i);
});

test("provides a private local dashboard for the men's circle process", async () => {
  const response = await render("/circulo-de-hombres-cantabria/dashboard");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Tu proceso,/i);
  assert.match(html, /Registro de sesiones/i);
  assert.match(html, /Intenciones y temas a trabajar/i);
  assert.match(html, /Reflexiones generales/i);
  assert.match(html, /Lo que puedo ofrecer/i);
  assert.match(html, /El apoyo que necesito/i);
  assert.match(meta(html, "robots"), /noindex, nofollow/i);

  const [dashboard, circle] = await Promise.all([
    readFile(new URL("../app/components/MensCircleDashboard.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/BrosState.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(dashboard, /window\.localStorage/);
  assert.match(dashboard, /origen-bros-dashboard-v1/);
  assert.match(circle, /href="\/circulo-de-hombres-cantabria\/dashboard"/);
});

test("publishes the warm weekly women’s circle page", async () => {
  const response = await render("/circulo-de-mujeres-cantabria");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /class="bros-page women-circle-page"/);
  assert.match(html, /Presencia · Cuidado · Expresión/);
  assert.match(html, /Martes · 18:00–20:00 · Origen/);
  assert.match(html, /Cada martes, de 18:00 a 20:00/);
  assert.match(html, /Círculo de/);
  assert.match(html, /Un espacio íntimo para volver a ti y encontrarte con otras/);
  assert.match(html, /Un espacio para ti/);
  assert.match(html, /Quiero participar/);
  assert.match(html, /href="https:\/\/chat\.whatsapp\.com\/KW3qQoKiLUk4LZIA0xZD5E\?s=cl&amp;p=i&amp;mlu=0"/);
  assert.match(html, /Conoce el espacio/);
  assert.match(html, /href="https:\/\/www\.instagram\.com\/origenliencres\/"/);
  assert.match(html, /Quién sostiene/);
  assert.match(html, /Conoce a Belén/);
  assert.match(html, /href="https:\/\/www\.instagram\.com\/ekarapsychology\/"/);
  assert.doesNotMatch(html, /Escucharse con más calma y claridad/);
  assert.doesNotMatch(html, /Un espacio que está tomando forma/);
});

test("publishes local SEO and machine-readable facts for both circles", async () => {
  const [menResponse, womenResponse, styles] = await Promise.all([
    render("/circulo-de-hombres-cantabria"),
    render("/circulo-de-mujeres-cantabria"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);
  assert.equal(menResponse.status, 200);
  assert.equal(womenResponse.status, 200);

  const [men, women] = await Promise.all([
    menResponse.text(),
    womenResponse.text(),
  ]);

  assert.match(men, /<title>Círculo de hombres en Cantabria \| Origen Bros<\/title>/);
  assert.match(men, /Círculo semanal de hombres en Origen Liencres/);
  assert.match(men, /¿Qué es el círculo de hombres de Origen\?/);
  assert.match(men, /"@type":"FAQPage"/);
  assert.match(men, /"@type":"Service"/);

  assert.match(women, /<title>Círculo de mujeres en Cantabria \| Origen Liencres<\/title>/);
  assert.match(women, /Cada martes de 18:00 a 20:00/);
  assert.match(women, /¿Qué es el círculo de mujeres de Origen\?/);
  assert.match(women, /"opens":"18:00","closes":"20:00"/);
  assert.match(women, /women-circle-organic\.jpg\?v=5/);

  assert.match(styles, /animation-timeline:\s*view\(block\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
});

test("uses the approved horizontal wordmarks on every page header", async () => {
  const [styles, brand, brandLink, invitation, editorial, organizer, booking, publicLanding, publicFaq, bros, experience, empoderate, hosts] = await Promise.all([
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/lib/brand.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/GatewayBrandLink.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/OpenedState.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/EditorialPage.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/OrganizerLanding.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/HouseBookingLanding.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/PublicRetreatLanding.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/PublicRetreatFaq.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/BrosState.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/ExperienceState.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/EmpoderateState.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/HostsCircleState.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(brand, /ORIGEN_HEADER_WORDMARK_WHITE_ASSET[\s\S]*origen-wordmark-horizontal-white\.png/);
  assert.match(brand, /ORIGEN_HEADER_WORDMARK_BLACK_ASSET[\s\S]*origen-wordmark-horizontal-black\.png/);
  assert.match(brandLink, /variant = "white"/);
  assert.match(brandLink, /variant === "black"[\s\S]*ORIGEN_HEADER_WORDMARK_BLACK_ASSET/);
  for (const lightPage of [invitation, editorial, organizer, booking]) {
    assert.match(lightPage, /<GatewayBrandLink[\s\S]{0,240}variant="black"/);
  }
  assert.match(publicLanding, /src=\{ORIGEN_HEADER_WORDMARK_BLACK_ASSET\}/);
  assert.match(publicFaq, /src=\{ORIGEN_HEADER_WORDMARK_BLACK_ASSET\}/);
  for (const darkPage of [bros, experience, empoderate, hosts]) {
    assert.match(darkPage, /<GatewayBrandLink/);
    assert.doesNotMatch(darkPage, /<GatewayBrandLink[\s\S]{0,240}variant="black"/);
  }
  assert.doesNotMatch(styles, /filter: grayscale\(1\) invert\(1\) contrast\(2\)/);
  assert.doesNotMatch(styles, /\.empower-brand\s*\{[^}]*filter:/);
  for (const selector of ["invitation-brand", "editorial-brand", "retreat-public-brand"]) {
    const standaloneRule = [...styles.matchAll(new RegExp(`\\.${selector} img \\{([^}]+)\\}`, "g"))].at(-1);
    assert.ok(standaloneRule);
    assert.match(standaloneRule[1], /width: 100%;/);
    assert.match(standaloneRule[1], /height: auto;/);
    assert.doesNotMatch(standaloneRule[1], /filter:/, `${selector} uses the supplied transparent asset directly`);
  }
  const experienceRule = styles.match(/\.experience-brand img\s*\{([^}]+)\}/);
  assert.ok(experienceRule);
  assert.doesNotMatch(experienceRule[1], /filter:/, "The dark experience header is unchanged");
});

test("publishes indexable organiser pages for retreats and events in both languages", async () => {
  const routes = [
    ["/organiza-tu-retiro-cantabria", /Organiza tu retiro en Origen/i, /facilitadores que tienen una práctica/i],
    ["/host-your-retreat-cantabria", /Host your retreat in Cantabria/i, /facilitators and retreat leaders/i],
    ["/eventos-bienestar-cantabria", /Organiza tu evento de bienestar en Cantabria/i, /quien organiza, facilita y reúne/i],
    ["/wellness-events-cantabria", /Host your wellness event in Cantabria/i, /person organising, facilitating and bringing/i],
  ];

  for (const [path, heading, organiserCopy] of routes) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.match(html, heading);
    assert.match(html, organiserCopy);
    assert.match(html, /1FAIpQLSf9DrIbIV4OKiswKQhuKsssMyVvuP_l8CROR0ijH0_WUQSpIw/);
    assert.match(html, /"@type":"Service"/);
    assert.match(meta(html, "robots"), /index, follow/);
    assert.match(html, new RegExp(`rel="canonical" href="${publicOrigin}${path}"`));
  }

  const [spanishFaq, englishFaq] = await Promise.all([
    (await render("/retiros-cantabria/preguntas-frecuentes")).text(),
    (await render("/retreats-spain/faq")).text(),
  ]);
  assert.match(spanishFaq, /Esta página está dirigida a organizadores que traen su propio grupo y programa/i);
  assert.match(spanishFaq, /href="\/organiza-tu-retiro-cantabria"/i);
  assert.match(englishFaq, /Is this a scheduled retreat or a venue\?/i);
  assert.match(englishFaq, /href="\/host-your-retreat-cantabria"/i);
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
  assert.match(html, /Alojamiento turístico y espacio para retiros, residencias y grupos privados/i);
  assert.doesNotMatch(html, /placeholder="Key to open"|type="password"/i);
  assert.doesNotMatch(html, /Origen is opening|gateway-opening-copy/i);
  assert.match(html, /origen-favicon\.png/i);
  assert.match(html, /rel="canonical" href="https:\/\/www\.origenliencres\.com\/"/i);
  assert.match(html, /application\/ld\+json/i);
  assert.match(html, /Alojamiento turístico y espacio privado para organizar retiros/i);
  assert.match(html, /"latitude":43\.4571267/i);
  assert.match(html, /"telephone":"\+34622181691"/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("both gateway variants complete automatically into the public home", async () => {
  for (const component of ["AccessGateway", "ReducedMotionGateway"]) {
    const source = await readFile(new URL(`../app/components/${component}.tsx`, import.meta.url), "utf8");
    assert.match(source, /<OrigenHomeState\s*\/>/, component);
    assert.doesNotMatch(source, /AccessKeyForm|Key to open|type="password"/, component);
  }
  const [home, navigation, menu, layout] = await Promise.all([
    readFile(new URL("../app/components/OrigenHomeState.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/HomeNavigation.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/PersistentSectionMenu.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(home, /A space of possibilities\./);
  assert.match(home, /href="\/organiza-tu-retiro-cantabria#host"/);
  assert.match(home, /origen-rebros-house-exterior\.avif/);
  assert.match(home, /9 guests · 3 bedrooms · 1 shala/);
  assert.match(home, /<HomeNavigation/);
  assert.match(menu, /HOME_LINKS\.map/);
  assert.match(layout, /<PersistentSectionMenu\s*\/>/);
  for (const [href, label] of [
    ["/circulo-de-hombres-cantabria", "Círculo de hombres"],
    ["/circulo-de-mujeres-cantabria", "Círculo de mujeres"],
    ["/residencias", "Residencias"],
    ["/retiros", "Retiros"],
    ["/eventos-bienestar-cantabria", "Eventos"],
  ]) {
    assert.match(navigation, new RegExp(`href: "${href}", label: "${label}"`));
  }
});

test("consolidates duplicate Spanish retreat routes by search intent", async () => {
  for (const [legacyRoute, destination] of [
    ["/espacio-retiros", "/retiros"],
    ["/organizar-retiro", "/organiza-tu-retiro-cantabria"],
  ]) {
    const response = await render(legacyRoute);
    assert.equal(response.status, 308);
    assert.equal(
      new URL(response.headers.get("location"), "http://localhost").href,
      `http://localhost${destination}`,
    );
  }
  const sitemap = await (await render("/sitemap.xml")).text();
  assert.doesNotMatch(sitemap, /<loc>https:\/\/www\.origenliencres\.com\/espacio-retiros<\/loc>/);
});

test("permanently redirects every renamed public route", async () => {
  for (const [legacyRoute, destination] of [
    ["/residencia", "/residencias"],
    ["/residency", "/residencies"],
    ["/retiro", "/retiros"],
    ["/retiros-en-cantabria", "/retiros"],
    ["/retiros-cantabria", "/retiros"],
    ["/espacio-retiros-cantabria", "/retiros"],
    ["/host-your-retreat", "/host-your-retreat-cantabria"],
    ["/retreats-spain", "/retreats"],
    ["/retreat-venue-spain", "/retreats"],
    ["/creative-residency-spain", "/artist-residencies-cantabria"],
    ["/eventos", "/eventos-bienestar-cantabria"],
    ["/circulo-de-hombres", "/circulo-de-hombres-cantabria"],
    ["/circulo-de-mujeres", "/circulo-de-mujeres-cantabria"],
  ]) {
    const response = await render(legacyRoute);
    assert.equal(response.status, 308, legacyRoute);
    assert.equal(
      new URL(response.headers.get("location"), "http://localhost").pathname,
      destination,
    );
  }
});

test("keeps all access keys server-only and destination-scoped", async () => {
  const [client, gateway, origenHome, homeNavigation, route, session, example, bros, invitation, editorial, instagram, experience, environment, sculpture, siteCopy, styles, robots, sitemap, brosPage, legacyBrosPage, residencyPage, spacePage, experiencePage, empoderatePage, empoderate] = await Promise.all([
    readFile(new URL("../app/components/AccessKeyForm.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/AccessGateway.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/OrigenHomeState.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/HomeNavigation.tsx", import.meta.url), "utf8"),
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
    readFile(new URL("../app/circulo-de-hombres-cantabria/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/bros/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/residencias-artisticas-cantabria/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/space/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/experience/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/retirobros/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/EmpoderateState.tsx", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(client, /ORIGEN_(?:BROS_|SPACE_)?ACCESS_KEY|Esencia/i);
  assert.match(gateway, /<OrigenHomeState\s*\/>/);
  assert.doesNotMatch(gateway, /AccessKeyForm|fetch\("\/api\/access"/);
  assert.match(origenHome, /A space of possibilities\./);
  assert.match(origenHome, /Book the space/);
  assert.match(homeNavigation, /href: "\/circulo-de-hombres-cantabria"/);
  assert.match(homeNavigation, /href: "\/circulo-de-mujeres-cantabria"/);
  assert.match(homeNavigation, /href: "\/residencias"/);
  assert.match(homeNavigation, /href: "\/retiros"/);
  assert.match(homeNavigation, /href: "\/eventos-bienestar-cantabria"/);
  assert.match(route, /matchAccessKey/);
  assert.match(route, /destination/);
  assert.match(session, /process\.env\.ORIGEN_ACCESS_KEY/);
  assert.match(session, /process\.env\.ORIGEN_BROS_ACCESS_KEY/);
  assert.match(session, /process\.env\.ORIGEN_SPACE_ACCESS_KEY/);
  assert.match(session, /process\.env\.ORIGEN_EXPERIENCE_ACCESS_KEY/);
  assert.match(session, /process\.env\.ORIGEN_HOSTS_ES_ACCESS_KEY/);
  assert.match(session, /process\.env\.ORIGEN_HOSTS_EN_ACCESS_KEY/);
  assert.match(session, /process\.env\.ORIGEN_EMPOWER_ACCESS_KEY/);
  assert.doesNotMatch(session, /["'](?:Esencia|Bros|Espacio|Experiencia|Proposito|Purpose|ReBro)["']/i);
  assert.equal(
    example,
    "ORIGEN_ACCESS_KEY=\nORIGEN_BROS_ACCESS_KEY=\nORIGEN_SPACE_ACCESS_KEY=\nORIGEN_EXPERIENCE_ACCESS_KEY=\nORIGEN_HOSTS_ES_ACCESS_KEY=\nORIGEN_HOSTS_EN_ACCESS_KEY=\nORIGEN_EMPOWER_ACCESS_KEY=\nAIRBNB_ICAL_URL=\nSTRIPE_SECRET_KEY=\nRESEND_API_KEY=\nRETREAT_APPLICATION_FROM_EMAIL=\n",
  );
  assert.match(
    bros,
    /https:\/\/docs\.google\.com\/forms\/d\/e\/1FAIpQLSd2uhreU_NDgC3-H9wOfcsP2w9Q_lixIq4Er_BsEMTTNB7W5g\/viewform["']/,
  );
  assert.match(bros, /https:\/\/chat\.whatsapp\.com\/F7Yg8F7zx1R3jA5ltgvKwS/);
  assert.match(bros, /Un espacio de autenticidad para hombres\./);
  assert.match(bros, />\s*UNIRME\s*</);
  assert.match(bros, /<strong>Solicitar acceso<\/strong>/);
  assert.match(bros, /href="https:\/\/revolut\.me\/mariogonzalezdia"/);
  assert.doesNotMatch(bros, /STRIPE_SECRET_KEY|STRIPE_BROS_MONTHLY_PRICE_ID/);
  assert.match(bros, /<strong>100 €<\/strong>/);
  assert.match(bros, /Pagar con Revolut/);
  assert.match(bros, /Accountability semanal/);
  assert.match(bros, /Martes · 7:30/);
  assert.match(bros, /docs\.google\.com\/spreadsheets\/d\/16jDB2CLi3YJVzIDIMzufYeu-XyzK4dOoJTMHzTBAyTY/);
  assert.match(bros, /no renueva el pago automáticamente/);
  assert.match(
    invitation,
    /https:\/\/docs\.google\.com\/forms\/d\/e\/1FAIpQLSf9DrIbIV4OKiswKQhuKsssMyVvuP_l8CROR0ijH0_WUQSpIw\/viewform\?usp=publish-editor["']/,
  );
  assert.match(invitation, /href=\{applicationFormUrl\}[\s\S]*<strong>\{copy\.join\}<\/strong>/);
  assert.match(
    siteCopy,
    /export const RESIDENCY_COPY =[\s\S]*join: "ENVIAR PROPUESTA"[\s\S]*export const SPACE_COPY =[\s\S]*join: "HOST"/,
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
    /https:\/\/www\.instagram\.com\/origenliencres\//,
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
  assert.doesNotMatch(experience, /experience-(?:atlantic|rock|coast|forest)\.webp/);
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
  assert.doesNotMatch(brosPage, /requireOrigenAccess/);
  assert.match(legacyBrosPage, /redirect\("\/circulo-de-hombres-cantabria"\)/);
  assert.doesNotMatch(residencyPage, /requireOrigenAccess/);
  assert.match(spacePage, /requireOrigenAccess\("space"\)/);
  assert.match(experiencePage, /requireOrigenAccess\("experience"\)/);
  assert.match(empoderatePage, /requireOrigenAccess\("empoderate"\)/);
  assert.match(empoderate, /<dd>555 €<\/dd>/);
  assert.match(empoderate, /Grupo selecto de 7 personas\./);
  assert.match(empoderate, /perfil\s+extraordinario para poder profundizar y vivir una experiencia única/);
  assert.doesNotMatch(empoderate, /Solo siete hombres/);
  assert.match(styles, /\.empower-page[\s\S]*url\("\/origen-bros-slate\.png"\)/);
  assert.match(empoderate, /Tres días entre hombres/);
  assert.match(empoderate, /Abundancia · Dirección · Acción\./);
  assert.match(empoderate, /title: "Vivirlo"/);
  assert.match(empoderate, /Conócete mejor y ten claridad sobre tu vida\./);
  assert.match(empoderate, /Hombres normales viviendo de forma extraordinaria\./);
  assert.match(empoderate, /explorar lo que significa ser un hombre con el mejor acompañamiento\./);
  assert.match(empoderate, /Hombres siendo hombres, hablando sobre cosas de las que normalmente/);
  assert.match(empoderate, /Compitiendo, jugando, compartiendo y amando lo que somos\./);
  assert.match(empoderate, /Durante tres días, este espacio será TU casa\./);
  assert.doesNotMatch(empoderate, /No venimos a enseñarte|Hombres hablando con hombres|empower-bros-extraordinary/);
  assert.match(empoderate, /Sabes que puede haber algo más/);
  assert.match(empoderate, /y que todo empieza por tu masculinidad\./);
  assert.match(empoderate, /Tienes el trabajo\. Amigos\. Proyectos\. Entrenas\. Viajas\. Pero\.\.\./);
  assert.match(empoderate, /className="empower-info-price"/);
  assert.match(empoderate, /Entrenas\. Viajas\. Pero\.\.\./);
  assert.doesNotMatch(empoderate, /Puede que tu vida esté bien|Quizá tienes pareja/);
  assert.match(empoderate, /<p className="empower-kicker">RETIRO DE HOMBRES<\/p>/);
  assert.match(empoderate, /<h1 id="empower-title">[\s\S]*<span>Retiro<\/span>[\s\S]*<span>Bros<\/span>[\s\S]*<\/h1>/);
  assert.match(empoderate, /11, 12, 13 DIC · 7 PLAZAS SELECTAS/);
  assert.match(empoderate, /<strong>EMPODERA<\/strong>/);
  assert.match(empoderate, /className="empower-closing-subtitle">Tu masculinidad<\/span>/);
  assert.match(empoderate, /Quizá solo necesitas el espacio para vivirlas\./);
  assert.doesNotMatch(empoderate, /crear el espacio para hacerte mejores preguntas/);
  assert.match(empoderate, /<dt>Fechas<\/dt><dd>11, 12 y 13 de diciembre<\/dd>/);
  assert.match(empoderate, /<dt>Grupo<\/dt><dd>7 plazas selectas<\/dd>/);
  assert.doesNotMatch(empoderate, /EMPODÉRATE|Finales de noviembre|NOV ·|de noviembre|7 hombres selectos|20, 21, 22 SEPT/);
  assert.match(empoderate, /src: "\/origen-rebros-bedroom\.jpg"/);
  assert.match(empoderate, /src: "\/origen-rebros-house-exterior\.avif"/);
  assert.doesNotMatch(empoderate, /a09bcf6c-b2cd-49f4-869e-bbdb4be31da8/);
  assert.doesNotMatch(empoderate, /b3c60d82-07b7-4f84-9080-c331a39599f7/);
  assert.doesNotMatch(empoderate, /empower-image-break|empower-bros-media/);
  assert.doesNotMatch(styles, /\.empower-image-break(?:--forest)?\s*\{/);
  assert.doesNotMatch(styles, /\.empower-bros-media/);
  const empowerClosingRule = styles.match(/\.empower-closing\s*\{([^}]+)\}/);
  assert.ok(empowerClosingRule);
  assert.match(empowerClosingRule[1], /background: transparent;/);
  assert.doesNotMatch(empowerClosingRule[1], /url\(/);
  assert.match(empoderate, /filter: "blur\(9px\)"/);
  assert.match(empoderate, /GATEWAY_MOTION\.opened\.textDelay/);
  assert.match(styles, /\.empower-page[\s\S]*font-family: "Montserrat Variable"/);
  assert.match(styles, /--empower-paper: #fffaf2;/);
  assert.match(styles, /--empower-accent: #406c90;/);
  assert.doesNotMatch(styles, /--empower-green:/);
  assert.match(styles, /\.empower-page::\-webkit-scrollbar\s*\{[\s\S]*?width: 0;[\s\S]*?height: 0;/);
  assert.match(styles, /@media \(max-width: 620px\)[\s\S]*?--empower-side-gap: 32px;/);
  assert.match(styles, /\.empower-gallery-item\s*\{[\s\S]*?aspect-ratio: 4 \/ 3;/);
  assert.match(styles, /\.empower-text-reveal[\s\S]*will-change: opacity, transform, filter/);
  assert.match(empoderate, /fetch\("\/api\/retreat-bros-application"/);
  assert.match(empoderate, /Usuario en redes sociales/);
  assert.match(empoderate, /social: formData\.get\("social"\)/);
  assert.match(empoderate, /Enviar solicitud/);
  assert.doesNotMatch(empoderate, /ReBro|ORIGEN_EMPOWER_ACCESS_KEY/);
  assert.match(styles, /\.empower-page/);

  const packageJson = await readFile(new URL("package.json", templateRoot), "utf8");
  assert.match(packageJson, /framer-motion/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
