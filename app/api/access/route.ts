import { NextResponse } from "next/server";
import {
  ACCESS_COOKIE_NAME,
  createSessionToken,
  isAccessKeyConfigured,
  matchAccessKey,
} from "../../lib/access-session";
import { ACCESS_DESTINATION_BY_SCOPE } from "../../lib/access-types";

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

  const response = NextResponse.json({
    ok: true,
    destination: ACCESS_DESTINATION_BY_SCOPE[scope],
  });
  response.cookies.set({
    name: ACCESS_COOKIE_NAME,
    value: await createSessionToken(scope),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

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
