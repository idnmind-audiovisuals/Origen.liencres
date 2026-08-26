"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";
import {
  LanguageToggle,
  usePersistentLanguage,
} from "./LanguageToggle";
import { GatewayBrandLink } from "./GatewayBrandLink";
import { InstagramLink } from "./InstagramLink";
import { CINEMATIC_ENTRY_EASE } from "../lib/gateway-motion";
import { localizedHref, type Language } from "../lib/language";
import {
  EDITORIAL_COPY,
  SHARED_EDITORIAL_COPY,
} from "../lib/site-copy";

type EditorialPageProps = {
  initialLanguage: Language;
  page: keyof typeof EDITORIAL_COPY;
  origin: "residency" | "space";
};

export function EditorialPage({
  initialLanguage,
  page,
  origin,
}: EditorialPageProps) {
  const reducedMotion = useReducedMotion();
  const { language, changeLanguage } =
    usePersistentLanguage(initialLanguage);
  const copy = EDITORIAL_COPY[page][language];
  const shared = SHARED_EDITORIAL_COPY[language];
  const originPath = origin === "space" ? "/space" : "/residency";
  const originLabel = origin === "space" ? shared.space : shared.residency;

  useEffect(() => {
    document.title = `${copy.title} — Origen`;
  }, [copy.title]);

  return (
    <main className="editorial-page">
      <motion.div
        className="editorial-content"
        initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: reducedMotion ? 0 : 0.08,
          duration: reducedMotion ? 0.01 : 0.7,
          ease: CINEMATIC_ENTRY_EASE,
        }}
      >
        <header className="editorial-header">
          <GatewayBrandLink
            className="editorial-brand"
            label={shared.brandLabel}
          />

          <div className="editorial-header-actions">
            <Link
              className="editorial-return"
              href={localizedHref(originPath, language)}
            >
              <span aria-hidden="true">←</span>
              {originLabel}
            </Link>
            <LanguageToggle
              language={language}
              onChange={changeLanguage}
            />
          </div>
        </header>

        <section className="editorial-hero" aria-labelledby="editorial-title">
          <p>{copy.chapter}</p>
          <h1 id="editorial-title">{copy.title}</h1>
        </section>

        <article className="editorial-copy">
          {copy.paragraphs.map((paragraph, index) => (
            <p key={paragraph} className={index === 0 ? "editorial-lede" : undefined}>
              {paragraph}
            </p>
          ))}
        </article>

        <nav className="editorial-navigation" aria-label={shared.navigationLabel}>
          <Link href={localizedHref(originPath, language)}>
            <small>{shared.returnTo}</small>
            <span>{originLabel}</span>
          </Link>
          <Link href={localizedHref(`/${copy.nextPage}`, language)}>
            <small>{shared.continueTo}</small>
            <span>{copy.nextLabel}</span>
          </Link>
        </nav>

        <footer className="editorial-footer">
          <p>Origen · Liencres</p>
          <p>{shared.footer}</p>
        </footer>

        <InstagramLink />
      </motion.div>
    </main>
  );
}
