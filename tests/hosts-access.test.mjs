import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import test from "node:test";

const fixtures = [
  { scope: "residency", env: "ORIGEN_ACCESS_KEY", destination: "/residency" },
  { scope: "bros", env: "ORIGEN_BROS_ACCESS_KEY", destination: "/circulo-de-hombres" },
  { scope: "space", env: "ORIGEN_SPACE_ACCESS_KEY", destination: "/space" },
  { scope: "experience", env: "ORIGEN_EXPERIENCE_ACCESS_KEY", destination: "/experience" },
  { scope: "hosts-es", env: "ORIGEN_HOSTS_ES_ACCESS_KEY", destination: "/retreat-organizers-circle?lang=es", language: "es" },
  { scope: "hosts-en", env: "ORIGEN_HOSTS_EN_ACCESS_KEY", destination: "/retreat-organizers-circle?lang=en", language: "en" },
].map((fixture) => ({ ...fixture, key: "Test-" + randomUUID() }));

for (const fixture of fixtures) process.env[fixture.env] = fixture.key;
const { default: worker } = await import("../dist/server/index.js");

async function request(path, options = {}) {
  return worker.fetch(
    new Request("http://localhost" + path, options),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

async function login(key, cookie = "") {
  return request("/api/access", {
    method: "POST",
    headers: { "content-type": "application/json", cookie },
    body: JSON.stringify({ key }),
  });
}

function cookieHeader(response) {
  return response.headers.getSetCookie().map((value) => value.split(";")[0]).join("; ");
}

function assertGatewayRedirect(response) {
  assert.equal(response.status, 307);
  assert.equal(new URL(response.headers.get("location"), "http://localhost").pathname, "/");
}

test("all six keys keep case-insensitive, signed, destination-scoped access", async () => {
  for (const fixture of fixtures) {
    for (const candidate of [fixture.key, fixture.key.toUpperCase(), "  " + fixture.key.toLowerCase() + "  "]) {
      const response = await login(candidate, "origen_language=" + (fixture.language === "es" ? "en" : "es"));
      assert.equal(response.status, 200, fixture.scope);
      assert.deepEqual(await response.json(), { ok: true, destination: fixture.destination });
      const accessCookie = response.headers.getSetCookie().find((value) => value.startsWith("origen_access="));
      assert.ok(accessCookie);
      assert.match(accessCookie, /HttpOnly/i);
      assert.match(accessCookie, /SameSite=Strict/i);
      assert.match(accessCookie, /Path=\//i);
      assert.doesNotMatch(accessCookie, /Max-Age|Expires|Test-/i);
      if (fixture.language) {
        assert.match(cookieHeader(response), new RegExp("origen_language=" + fixture.language));
      }
    }
    const response = await login(fixture.key);
    const cookie = cookieHeader(response);
    const home = await request("/", { headers: { cookie } });
    assert.equal(home.status, 307);
    const destination = new URL(home.headers.get("location"), "http://localhost");
    assert.equal(destination.pathname + destination.search, fixture.destination);
    for (const other of fixtures) {
      if (other.scope === fixture.scope || (fixture.language && other.language)) continue;
      assertGatewayRedirect(await request(other.destination, { headers: { cookie } }));
    }
  }
});

test("both circle translations render after access with matching copy and pending registration", async () => {
  for (const fixture of fixtures.filter((item) => item.language)) {
    const loginResponse = await login(fixture.key);
    const cookie = cookieHeader(loginResponse);
    // The password preference must survive refresh even without a lang query.
    const response = await request("/retreat-organizers-circle", { headers: { cookie } });
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, new RegExp('<main class="bros-page hosts-circle-page" lang="' + fixture.language + '"'));
    assert.match(html, /invitation-texture bros-texture/);
    assert.match(html, /class="bros-brand"/);
    assert.equal([...html.matchAll(/<h1\b/g)].length, 1);
    assert.match(html, /<h1 id="hosts-title"><span>Retreat<\/span><span>Hosts<\/span><\/h1>/);
    assert.doesNotMatch(html, /Origen Hosts|A circle for the people who bring others together/);
    assert.match(html, /Europe\/Madrid/);
    assert.match(html, /dateTime="17:00"/);
    assert.match(html, /name="robots" content="noindex, nofollow/);
    assert.doesNotMatch(html, /property="og:image"|name="twitter:image"/);
    assert.match(html, /<button class="hosts-join-link" type="button" disabled=""/);
    assert.match(html, /aria-describedby="hosts-form-note"/);
    assert.match(html, /href="#join"/);
    assert.match(html, /scroll-reveal-list/);
    assert.doesNotMatch(html, /type="password"|docs\.google\.com\/forms|form\.typeform|chat\.whatsapp|zoom\.us/);
    const minutes = [...html.matchAll(/class="hosts-step-duration">(\d+)/g)].map((match) => Number(match[1]));
    assert.equal(minutes.length, 5);
    assert.equal(minutes.reduce((sum, value) => sum + value, 0), 90);
    if (fixture.language === "es") {
      assert.match(html, /Círculo de organizadores de retiros — Retreat Hosts/);
      assert.match(html, /Un grupo de organizadores de espacios de retiro con propósito\./);
      assert.match(html, /Primer martes de cada mes/);
      assert.match(html, /¿Quién sostiene tu espacio\?/);
      assert.match(html, /Confidencialidad/);
      assert.match(html, /Un logro\./);
      assert.match(html, /Un desafío\./);
      assert.match(html, /Un ofrecimiento\./);
      assert.match(html, /Formulario de participación próximamente/);
      assert.match(html, /hora peninsular española/);
      assert.match(html, /Cambiar a inglés/);
      assert.match(html, /href="\/espacio-retiros-cantabria"/);
      assert.doesNotMatch(html, /Who holds space for you|Joining form coming soon/);
    } else {
      assert.match(html, /Retreat Organisers Circle — Retreat Hosts/);
      assert.match(html, /A group of retreat venue organizers with purpose\./);
      assert.match(html, /First Tuesday of every month/);
      assert.match(html, /daylight-saving changes/);
      assert.match(html, /Who holds space for you\?/);
      assert.match(html, /Confidentiality/);
      assert.match(html, /One win\./);
      assert.match(html, /Joining form coming soon/);
      assert.match(html, /Switch to Spanish/);
      assert.match(html, /href="\/retreat-venue-spain"/);
      assert.doesNotMatch(html, /¿Quién sostiene tu espacio|Formulario de participación próximamente/);
    }
    // Language is a preference, not a second authorization boundary.
    const otherLanguage = fixture.language === "es" ? "en" : "es";
    const translated = await request("/retreat-organizers-circle?lang=" + otherLanguage, { headers: { cookie } });
    assert.equal(translated.status, 200);
    assert.match(await translated.text(), new RegExp('<main class="bros-page hosts-circle-page" lang="' + otherLanguage + '"'));
  }
});

test("wrong keys, forged sessions and direct links cannot enter; logout clears access", async () => {
  for (const invalid of ["", "not-a-valid-key", null, 17, {}]) {
    const response = await login(invalid);
    assert.equal(response.status, 401);
    assert.deepEqual(await response.json(), { ok: false });
    assert.equal(response.headers.getSetCookie().length, 0);
  }
  const malformed = await request("/api/access", {
    method: "POST", headers: { "content-type": "application/json" }, body: "{",
  });
  assert.equal(malformed.status, 400);
  for (const language of ["en", "es"]) {
    assertGatewayRedirect(await request("/retreat-organizers-circle?lang=" + language));
    const redirect = await request("/retreat-organizers-circle?lang=" + language, {
      headers: { cookie: "origen_language=" + language + "; origen_access=v2.hosts-" + language + ".forged" },
    });
    assertGatewayRedirect(redirect);
  }
  const authorised = await login(fixtures[4].key);
  const cookie = cookieHeader(authorised);
  assertGatewayRedirect(await request("/space", { headers: { cookie: cookie.replace("v2.hosts-es.", "v2.space.") } }));
  const logout = await request("/api/access", { method: "DELETE", headers: { cookie } });
  assert.equal(logout.status, 200);
  assert.match(logout.headers.get("set-cookie"), /origen_access=;.*Max-Age=0/i);
  assertGatewayRedirect(await request("/retreat-organizers-circle", { headers: { cookie: cookieHeader(logout) } }));
  const home = await request("/", { headers: { cookie: cookieHeader(logout) } });
  assert.equal(home.status, 200);
  assert.match(await home.text(), /class="gateway/);

  // Removing a configured key revokes its existing signed sessions.
  delete process.env.ORIGEN_HOSTS_ES_ACCESS_KEY;
  assertGatewayRedirect(await request("/retreat-organizers-circle", { headers: { cookie } }));
  process.env.ORIGEN_HOSTS_ES_ACCESS_KEY = fixtures[4].key;
});

test("both animation paths render the new destination only after success", async () => {
  for (const filename of ["AccessGateway.tsx", "ReducedMotionGateway.tsx"]) {
    const source = await readFile(new URL("../app/components/" + filename, import.meta.url), "utf8");
    assert.match(source, /getHostsCircleLanguage\(destination\)/);
    assert.match(source, /(?:state|phase) === "opened" && hostsLanguage/);
    assert.match(source, /<HostsCircleState initialLanguage=\{hostsLanguage\}/);
    assert.match(source, /GATEWAY_MOTION/);
    assert.doesNotMatch(source, /Proposito|Purpose|ORIGEN_HOSTS_.*ACCESS_KEY/);
  }
  const brand = await readFile(new URL("../app/components/GatewayBrandLink.tsx", import.meta.url), "utf8");
  assert.match(brand, /fetch\("\/api\/access", \{ method: "DELETE" \}\)/);
  assert.match(brand, /window\.location\.replace\("\/"\)/);
  const assets = new URL("../dist/client/assets/", import.meta.url);
  for (const filename of await readdir(assets)) {
    if (!filename.endsWith(".js")) continue;
    const content = await readFile(new URL(filename, assets), "utf8");
    assert.doesNotMatch(content, /ORIGEN_HOSTS_(?:ES|EN)_ACCESS_KEY/, filename);
  }
});
