import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ACCESS_COOKIE_NAME,
  verifySessionToken,
} from "./access-session";

export async function requireOrigenAccess() {
  const cookieStore = await cookies();
  const authenticated = await verifySessionToken(
    cookieStore.get(ACCESS_COOKIE_NAME)?.value,
  );

  if (!authenticated) redirect("/");
}
