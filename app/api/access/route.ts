import { NextResponse } from "next/server";
import {
  ACCESS_COOKIE_NAME,
  createSessionToken,
  isAccessKeyConfigured,
  matchesAccessKey,
} from "../../lib/access-session";

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

  if (!(await matchesAccessKey(candidate))) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ACCESS_COOKIE_NAME,
    value: await createSessionToken(),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  return response;
}

export async function DELETE() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ACCESS_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  return response;
}
