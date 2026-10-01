import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const APPLICATION_EMAIL = "origen.liencres@gmail.com";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ApplicationRequest = {
  name?: unknown;
  age?: unknown;
  city?: unknown;
  contact?: unknown;
  work?: unknown;
  moment?: unknown;
  explore?: unknown;
  why?: unknown;
  website?: unknown;
  consent?: unknown;
  startedAt?: unknown;
};

function error(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function line(label: string, value: string) {
  return `<p><strong>${escapeHtml(label)}</strong><br>${escapeHtml(value).replaceAll("\n", "<br>")}</p>`;
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 20_000) return error("La solicitud es demasiado extensa.", 413);

  let body: ApplicationRequest;
  try {
    body = (await request.json()) as ApplicationRequest;
  } catch {
    return error("La solicitud no es válida.");
  }

  // Honeypot: bots receive a successful response without delivering mail.
  if (clean(body.website, 200)) return NextResponse.json({ ok: true });

  const name = clean(body.name, 80);
  const age = Number(clean(body.age, 3));
  const city = clean(body.city, 80);
  const contact = clean(body.contact, 120);
  const work = clean(body.work, 1000);
  const moment = clean(body.moment, 2000);
  const explore = clean(body.explore, 2000);
  const why = clean(body.why, 2000);
  const startedAt = Number(body.startedAt);

  if (!name || !city || !contact || !work || !moment || !explore || !why) {
    return error("Completa todos los campos antes de enviar la solicitud.");
  }
  if (!Number.isInteger(age) || age < 18 || age > 100) {
    return error("Debes ser mayor de 18 años para enviar la solicitud.");
  }
  if (body.consent !== true) {
    return error("Necesitamos tu autorización para gestionar la solicitud.");
  }
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < 2_500) {
    return error("Espera unos segundos antes de enviar la solicitud.");
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RETREAT_APPLICATION_FROM_EMAIL?.trim();
  if (!apiKey || !from) {
    return error("El envío de solicitudes todavía no está configurado.", 503);
  }

  const html = [
    "<h1>Nueva solicitud · Retiro Bros</h1>",
    line("Nombre", name),
    line("Edad", String(age)),
    line("Ciudad", city),
    line("WhatsApp / Email", contact),
    line("¿A qué se dedica?", work),
    line("Momento actual", moment),
    line("Qué quiere explorar", explore),
    line("Por qué le interesa", why),
  ].join("");
  const text = [
    "Nueva solicitud · Retiro Bros",
    `Nombre: ${name}`,
    `Edad: ${age}`,
    `Ciudad: ${city}`,
    `WhatsApp / Email: ${contact}`,
    `¿A qué se dedica?: ${work}`,
    `Momento actual: ${moment}`,
    `Qué quiere explorar: ${explore}`,
    `Por qué le interesa: ${why}`,
  ].join("\n\n");

  const payload: Record<string, unknown> = {
    from,
    to: [APPLICATION_EMAIL],
    subject: `Nueva solicitud Retiro Bros · ${name}`,
    html,
    text,
  };
  if (EMAIL_PATTERN.test(contact)) payload.reply_to = contact;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    if (!response.ok) throw new Error("RESEND_FAILED");
    return NextResponse.json({ ok: true });
  } catch {
    return error("No hemos podido enviar la solicitud. Inténtalo de nuevo más tarde.", 502);
  }
}
