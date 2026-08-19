import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ACCESS_COOKIE_NAME,
  getAccessScopeFromSessionToken,
  verifySessionToken,
} from "./access-session";
import type { AccessScope } from "./access-types";

export async function getOrigenAccessScope() {
  const cookieStore = await cookies();
  return getAccessScopeFromSessionToken(
    cookieStore.get(ACCESS_COOKIE_NAME)?.value,
  );
}

export async function requireOrigenAccess(requiredScope: AccessScope) {
  const cookieStore = await cookies();
  const authenticated = await verifySessionToken(
    cookieStore.get(ACCESS_COOKIE_NAME)?.value,
    requiredScope,
  );

  if (!authenticated) redirect("/");
}
