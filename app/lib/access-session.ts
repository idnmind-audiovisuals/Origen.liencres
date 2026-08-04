const encoder = new TextEncoder();

export const ACCESS_COOKIE_NAME = "origen_access";

const SESSION_MESSAGE = "origen-access:v1";

function bytesToHex(bytes: ArrayBuffer) {
  return Array.from(new Uint8Array(bytes), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

function safeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;

  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return difference === 0;
}

async function digest(value: string) {
  return bytesToHex(await crypto.subtle.digest("SHA-256", encoder.encode(value)));
}

async function sign(message: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  return bytesToHex(
    await crypto.subtle.sign("HMAC", key, encoder.encode(message)),
  );
}

function getAccessKey() {
  return process.env.ORIGEN_ACCESS_KEY?.trim() ?? "";
}

export function isAccessKeyConfigured() {
  return getAccessKey().length > 0;
}

export async function matchesAccessKey(candidate: string) {
  const expected = getAccessKey();
  if (!expected) return false;

  const normalizedCandidate = candidate.trim().toLocaleLowerCase("en-US");
  const normalizedExpected = expected.toLocaleLowerCase("en-US");
  const [candidateDigest, expectedDigest] = await Promise.all([
    digest(normalizedCandidate),
    digest(normalizedExpected),
  ]);

  return safeEqual(candidateDigest, expectedDigest);
}

export async function createSessionToken() {
  const secret = getAccessKey();
  if (!secret) throw new Error("ORIGEN_ACCESS_KEY is not configured");

  return `v1.${await sign(SESSION_MESSAGE, secret)}`;
}

export async function verifySessionToken(token: string | undefined) {
  const secret = getAccessKey();
  if (!secret || !token?.startsWith("v1.")) return false;

  const expected = `v1.${await sign(SESSION_MESSAGE, secret)}`;
  return safeEqual(token, expected);
}
