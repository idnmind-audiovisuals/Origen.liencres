"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef } from "react";
import {
  LanguageToggle,
  usePersistentLanguage,
} from "./LanguageToggle";
import { ORIGEN_WORDMARK_ASSET } from "../lib/brand";
import {
  CINEMATIC_ENTRY_EASE,
  GATEWAY_MOTION,
} from "../lib/gateway-motion";
import { localizedHref, type Language } from "../lib/language";
import { RESIDENCY_COPY } from "../lib/site-copy";

type OpenedStateProps = {
  development: boolean;
  initialLanguage: Language;
  onReset?: () => void;
};

const SPACE_URL =
  "https://es-l.airbnb.com/rooms/23250801?source_impression_id=p3_1785061106_P3QhtYkp0415WTpb&modal=PHOTO_TOUR_SCROLLABLE";
const MAPS_URL = "https://maps.app.goo.gl/CcDJ15DKT4QvTdW4A";
const TYPEFORM_URL = "https://form.typeform.com/to/akvuhWjN";
const WHATSAPP_URL =
  "https://chat.whatsapp.com/IKwsVlegd9w8vDQ4iW6EZa";

export function OpenedState({
  development,
  initialLanguage,
  onReset,
}: OpenedStateProps) {
  const pageRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { language, changeLanguage } =
    usePersistentLanguage(initialLanguage);
  const copy = RESIDENCY_COPY[language];
  const backgroundDuration = reducedMotion
    ? GATEWAY_MOTION.opened.reducedBackgroundDuration
    : GATEWAY_MOTION.opened.backgroundDuration;
  const contentDelay = reducedMotion
    ? backgroundDuration
    : GATEWAY_MOTION.opened.textDelay;
  const contentDuration = reducedMotion
    ? 0.08
    : GATEWAY_MOTION.opened.textDuration;

  useLayoutEffect(() => {
    if (!pageRef.current) return;

    pageRef.current.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  useEffect(() => {
    document.title =
      language === "es"
        ? "Residencia en España — Origen"
        : "Spain Residency — Origen";
  }, [language]);

  return (
    <motion.main
      ref={pageRef}
      id="invitation-top"
      className="invitation-page"
      initial={{ backgroundColor: "#24231f" }}
      animate={{ backgroundColor: "#f2efe8" }}
      transition={{ duration: backgroundDuration, ease: CINEMATIC_ENTRY_EASE }}
    >
      <p className="sr-only" role="status" aria-live="polite">
        {copy.status}
      </p>

      <motion.div
        className="invitation-texture"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: reducedMotion ? 0 : contentDelay * 0.55,
          duration: reducedMotion ? 0.08 : 0.85,
          ease: CINEMATIC_ENTRY_EASE,
        }}
      />

      <motion.div
        className="invitation-content"
        initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: contentDelay,
          duration: contentDuration,
          ease: CINEMATIC_ENTRY_EASE,
        }}
      >
        <header className="invitation-header">
          <a
            className="invitation-brand"
            href="#invitation-top"
            aria-label={copy.brandLabel}
          >
            {/* The approved wordmark is preserved at its original proportions. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ORIGEN_WORDMARK_ASSET}
              width="1090"
              height="296"
              alt="Origen"
              draggable="false"
            />
          </a>

          <div className="invitation-header-actions">
            <p className="invitation-availability">
              <span aria-hidden="true" />
              {copy.availability}
            </p>
            <LanguageToggle
              language={language}
              onChange={changeLanguage}
            />
          </div>
        </header>

        <p className="invitation-tagline">{copy.tagline}</p>

        <section className="invitation-hero" aria-labelledby="residency-title">
          <div className="invitation-title-block">
            <p className="invitation-eyebrow">{copy.eyebrow}</p>
            <h1 id="residency-title">
              {copy.title.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h1>
          </div>

          <dl className="invitation-details">
            {copy.details.map((detail) => (
              <div key={detail.term}>
                <dt>{detail.term}</dt>
                <dd aria-label={"ariaLabel" in detail ? detail.ariaLabel : undefined}>
                  {detail.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="invitation-program" aria-labelledby="program-title">
          <div className="invitation-program-heading">
            <p>{copy.programEyebrow}</p>
            <h2 id="program-title">{copy.programTitle}</h2>
          </div>

          <ol className="invitation-experiences">
            {copy.experiences.map((experience, index) => (
              <li key={index}>
                <span aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {experience}
              </li>
            ))}
          </ol>
        </section>

        <nav className="invitation-links" aria-label={copy.linksLabel}>
          <a href={SPACE_URL} target="_blank" rel="noreferrer">
            <span>
              <small>{copy.stay}</small>
              {copy.space}
            </span>
            <span aria-hidden="true">↗</span>
          </a>
          <a href={MAPS_URL} target="_blank" rel="noreferrer">
            <span>
              <small>{copy.location}</small>
              {copy.maps}
            </span>
            <span aria-hidden="true">↗</span>
          </a>
          <Link href={localizedHref("/story", language)}>
            <span>
              <small>Origen</small>
              {copy.story}
            </span>
            <span aria-hidden="true">→</span>
          </Link>
          <Link href={localizedHref("/vision", language)}>
            <span>
              <small>Origen</small>
              {copy.vision}
            </span>
            <span aria-hidden="true">→</span>
          </Link>
        </nav>

        <a
          className="invitation-join"
          href={TYPEFORM_URL}
          target="_blank"
          rel="noreferrer"
        >
          <small>{copy.joinEyebrow}</small>
          <span className="invitation-join-label">{copy.join}</span>
          <span className="invitation-join-arrow" aria-hidden="true">
            ↗
          </span>
        </a>

        <a
          className="invitation-interest"
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
        >
          <span>
            <small>{copy.interestEyebrow}</small>
            <strong>{copy.interest}</strong>
          </span>
          <span aria-hidden="true">↗</span>
        </a>

        <footer className="invitation-footer">
          <p>{copy.footerLocation}</p>
          <p>{copy.footerDate}</p>
        </footer>

        {development && onReset ? (
          <button
            className="session-reset invitation-session-reset"
            type="button"
            onClick={onReset}
          >
            {copy.reset}
          </button>
        ) : null}
      </motion.div>
    </motion.main>
  );
}
