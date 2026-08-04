"use client";

import { useCallback, useEffect, useState } from "react";
import {
  LANGUAGE_COOKIE_NAME,
  type Language,
} from "../lib/language";

export function usePersistentLanguage(initialLanguage: Language) {
  const [language, setLanguage] = useState<Language>(initialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const changeLanguage = useCallback((nextLanguage: Language) => {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${LANGUAGE_COOKIE_NAME}=${nextLanguage}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
    const url = new URL(window.location.href);
    if (nextLanguage === "es") url.searchParams.set("lang", "es");
    else url.searchParams.delete("lang");
    window.history.replaceState(window.history.state, "", url);
    document.documentElement.lang = nextLanguage;
    setLanguage(nextLanguage);
  }, []);

  return { language, changeLanguage };
}

type LanguageToggleProps = {
  language: Language;
  onChange: (language: Language) => void;
};

export function LanguageToggle({
  language,
  onChange,
}: LanguageToggleProps) {
  const nextLanguage = language === "en" ? "es" : "en";
  const label =
    language === "en" ? "Switch to Spanish" : "Cambiar a inglés";

  return (
    <button
      className="language-toggle"
      type="button"
      lang={nextLanguage}
      aria-label={label}
      title={label}
      onClick={() => onChange(nextLanguage)}
    >
      {nextLanguage.toUpperCase()}
    </button>
  );
}
