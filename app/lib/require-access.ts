import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ACCESS_COOKIE_NAME,
  getAccessScopeFromSessionToken,
} from "./access-session";
import type { AccessScope } from "./access-types";

type RequiredAccessScope<T> = T extends readonly AccessScope[]
  ? T[number]
  : T extends AccessScope
    ? T
    : never;

export async function getOrigenAccessScope() {
  const cookieStore = await cookies();
  return getAccessScopeFromSessionToken(
    cookieStore.get(ACCESS_COOKIE_NAME)?.value,
  );
}

export async function requireOrigenAccess<
  const T extends AccessScope | readonly AccessScope[],
>(requiredScope: T): Promise<RequiredAccessScope<T>> {
  const cookieStore = await cookies();
  const scope = await getAccessScopeFromSessionToken(
    cookieStore.get(ACCESS_COOKIE_NAME)?.value,
  );
  const requiredScopes: readonly AccessScope[] =
    typeof requiredScope === "string" ? [requiredScope] : requiredScope;

  if (!scope || !requiredScopes.includes(scope)) redirect("/");
  return scope as RequiredAccessScope<T>;
}
