"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";
import {
  LanguageToggle,
  usePersistentLanguage,
} from "./LanguageToggle";
import { ORIGEN_WORDMARK_ASSET } from "../lib/brand";
import { CINEMATIC_ENTRY_EASE } from "../lib/gateway-motion";
import { localizedHref, type Language } from "../lib/language";
import {
  EDITORIAL_COPY,
  SHARED_EDITORIAL_COPY,
} from "../lib/site-copy";

type EditorialPageProps = {
  initialLanguage: Language;
  page: keyof typeof EDITORIAL_COPY;
};

export function EditorialPage({
  initialLanguage,
  page,
}: EditorialPageProps) {
  const reducedMotion = useReducedMotion();
  const { language, changeLanguage } =
    usePersistentLanguage(initialLanguage);
  const copy = EDITORIAL_COPY[page][language];
  const shared = SHARED_EDITORIAL_COPY[language];

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
          <Link
            className="editorial-brand"
            href={localizedHref("/residency", language)}
            aria-label={shared.brandLabel}
          >
            {/* Preserve the approved wordmark at its original proportions. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ORIGEN_WORDMARK_ASSET}
              width="1090"
              height="296"
              alt="Origen"
              draggable="false"
            />
          </Link>

          <div className="editorial-header-actions">
            <Link
              className="editorial-return"
              href={localizedHref("/residency", language)}
            >
              <span aria-hidden="true">←</span>
              {shared.returnTop}
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
          <Link href={localizedHref("/residency", language)}>
            <small>{shared.returnTo}</small>
            <span>{shared.residency}</span>
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
      </motion.div>
    </main>
  );
}
