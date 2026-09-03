import { NextResponse } from "next/server";
import {
  ACCESS_COOKIE_NAME,
  createSessionToken,
  isAccessKeyConfigured,
  matchAccessKey,
} from "../../lib/access-session";
import { ACCESS_DESTINATION_BY_SCOPE, getHostsCircleLanguage } from "../../lib/access-types";
import { LANGUAGE_COOKIE_NAME } from "../../lib/language";

export async function POST(request: Request) {
  if (!isAccessKeyConfigured()) {
    return NextResponse.json(
      { ok: false, reason: "unavailable" },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const candidate =
    typeof body === "object" &&
    body !== null &&
    "key" in body &&
    typeof body.key === "string"
      ? body.key
      : "";

  const scope = await matchAccessKey(candidate);
  if (!scope) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const destination = ACCESS_DESTINATION_BY_SCOPE[scope];
  const response = NextResponse.json({
    ok: true,
    destination,
  });
  response.cookies.set({
    name: ACCESS_COOKIE_NAME,
    value: await createSessionToken(scope),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  const language = getHostsCircleLanguage(destination);
  if (language) {
    response.cookies.set({
      name: LANGUAGE_COOKIE_NAME,
      value: language,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 31536000,
    });
  }

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ACCESS_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  return response;
}
