import "server-only";

import {
  ACCESS_SCOPES,
  isAccessScope,
  type AccessScope,
} from "./access-types";

const encoder = new TextEncoder();

export const ACCESS_COOKIE_NAME = "origen_access";

const SESSION_VERSION = "v2";

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

function normalizeAccessKey(value: string) {
  return value.trim().toLocaleLowerCase("en-US");
}

function getAccessKey(scope: AccessScope) {
  const value = {
    residency: process.env.ORIGEN_ACCESS_KEY,
    bros: process.env.ORIGEN_BROS_ACCESS_KEY,
    space: process.env.ORIGEN_SPACE_ACCESS_KEY,
    experience: process.env.ORIGEN_EXPERIENCE_ACCESS_KEY,
    "hosts-es": process.env.ORIGEN_HOSTS_ES_ACCESS_KEY,
    "hosts-en": process.env.ORIGEN_HOSTS_EN_ACCESS_KEY,
  }[scope];

  return value?.trim() ?? "";
}

function sessionMessage(scope: AccessScope) {
  return `origen-access:${SESSION_VERSION}:${scope}`;
}

export function isAccessKeyConfigured() {
  return ACCESS_SCOPES.some((scope) => getAccessKey(scope).length > 0);
}

export async function matchAccessKey(
  candidate: string,
): Promise<AccessScope | null> {
  const candidateDigest = await digest(normalizeAccessKey(candidate));
  const configuredKeys = ACCESS_SCOPES.map((scope) => ({
    scope,
    value: getAccessKey(scope),
  }));
  const expectedDigests = await Promise.all(
    configuredKeys.map(({ value }) => digest(normalizeAccessKey(value))),
  );

  let match: AccessScope | null = null;
  configuredKeys.forEach(({ scope, value }, index) => {
    if (value && safeEqual(candidateDigest, expectedDigests[index])) {
      match = scope;
    }
  });

  return match;
}

export async function createSessionToken(scope: AccessScope) {
  const secret = getAccessKey(scope);
  if (!secret) throw new Error(`Access key is not configured for ${scope}`);

  const signature = await sign(sessionMessage(scope), secret);
  return `${SESSION_VERSION}.${scope}.${signature}`;
}

export async function getAccessScopeFromSessionToken(
  token: string | undefined,
): Promise<AccessScope | null> {
  const [version, rawScope, signature, ...remainder] = token?.split(".") ?? [];
  if (
    version !== SESSION_VERSION ||
    remainder.length > 0 ||
    !isAccessScope(rawScope) ||
    !signature
  ) {
    return null;
  }

  const secret = getAccessKey(rawScope);
  if (!secret) return null;

  const expected = await sign(sessionMessage(rawScope), secret);
  return safeEqual(signature, expected) ? rawScope : null;
}

export async function verifySessionToken(
  token: string | undefined,
  requiredScope?: AccessScope,
) {
  const scope = await getAccessScopeFromSessionToken(token);
  return scope !== null && (!requiredScope || scope === requiredScope);
}
