import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
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

test("server-renders the Origen gateway", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Origen Residency<\/title>/i);
  assert.match(html, /Origen access gateway/i);
  assert.match(html, /origen-favicon\.png/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("keeps all access keys server-only and destination-scoped", async () => {
  const [client, route, session, example, bros, brosPage, residencyPage, spacePage] = await Promise.all([
    readFile(new URL("../app/components/AccessKeyForm.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/api/access/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/lib/access-session.ts", import.meta.url), "utf8"),
    readFile(new URL("../.env.example", import.meta.url), "utf8"),
    readFile(new URL("../app/components/BrosState.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/bros/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/residency/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/space/page.tsx", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(client, /ORIGEN_(?:BROS_|SPACE_)?ACCESS_KEY|Esencia/i);
  assert.match(route, /matchAccessKey/);
  assert.match(route, /destination/);
  assert.match(session, /process\.env\.ORIGEN_ACCESS_KEY/);
  assert.match(session, /process\.env\.ORIGEN_BROS_ACCESS_KEY/);
  assert.match(session, /process\.env\.ORIGEN_SPACE_ACCESS_KEY/);
  assert.doesNotMatch(session, /["'](?:Esencia|Bros|Espacio)["']/i);
  assert.equal(
    example,
    "ORIGEN_ACCESS_KEY=\nORIGEN_BROS_ACCESS_KEY=\nORIGEN_SPACE_ACCESS_KEY=\n",
  );
  assert.match(
    bros,
    /https:\/\/docs\.google\.com\/forms\/d\/e\/1FAIpQLSd2uhreU_NDgC3-H9wOfcsP2w9Q_lixIq4Er_BsEMTTNB7W5g\/viewform["']/,
  );
  assert.match(bros, /https:\/\/chat\.whatsapp\.com\/F7Yg8F7zx1R3jA5ltgvKwS/);
  assert.match(brosPage, /requireOrigenAccess\("bros"\)/);
  assert.match(residencyPage, /requireOrigenAccess\("residency"\)/);
  assert.match(spacePage, /requireOrigenAccess\("space"\)/);

  const packageJson = await readFile(new URL("package.json", templateRoot), "utf8");
  assert.match(packageJson, /framer-motion/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
