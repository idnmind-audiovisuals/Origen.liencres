export const LANGUAGE_COOKIE_NAME = "origen_language";

export type Language = "en" | "es";

export type LanguageSearchParams = Promise<{
  lang?: string | string[];
}>;

export const DEFAULT_LANGUAGE: Language = "en";

export function normalizeLanguage(value: string | undefined): Language {
  return value === "es" ? "es" : DEFAULT_LANGUAGE;
}

export function getLanguageParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function localizedHref(pathname: string, language: Language) {
  return language === "es" ? `${pathname}?lang=es` : pathname;
}
