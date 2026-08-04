import "server-only";

import { cookies } from "next/headers";
import { LANGUAGE_COOKIE_NAME, normalizeLanguage } from "./language";

export async function getRequestLanguage(requestedLanguage?: string) {
  if (requestedLanguage === "en" || requestedLanguage === "es") {
    return requestedLanguage;
  }

  const cookieStore = await cookies();
  return normalizeLanguage(cookieStore.get(LANGUAGE_COOKIE_NAME)?.value);
}
