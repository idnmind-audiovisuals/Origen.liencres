"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ORIGEN_WORDMARK_ASSET } from "../lib/brand";
import {
  CINEMATIC_ENTRY_EASE,
  GATEWAY_MOTION,
} from "../lib/gateway-motion";

type OpenedStateProps = {
  development: boolean;
  onReset?: () => void;
};

const SPACE_URL =
  "https://es-l.airbnb.com/rooms/23250801?source_impression_id=p3_1785061106_P3QhtYkp0415WTpb&modal=PHOTO_TOUR_SCROLLABLE";
const MAPS_URL = "https://maps.app.goo.gl/CcDJ15DKT4QvTdW4A";

const experiences = [
  "Nature adventures",
  "Ecstatic Dance",
  "Contact",
  "Within a UNESCO Global Geopark",
  "Tantric nights under the stars",
  "Ceremonies…",
] as const;

export function OpenedState({ development, onReset }: OpenedStateProps) {
  const reducedMotion = useReducedMotion();
  const backgroundDuration = reducedMotion
    ? GATEWAY_MOTION.opened.reducedBackgroundDuration
    : GATEWAY_MOTION.opened.backgroundDuration;
  const contentDelay = reducedMotion
    ? backgroundDuration
    : GATEWAY_MOTION.opened.textDelay;
  const contentDuration = reducedMotion
    ? 0.08
    : GATEWAY_MOTION.opened.textDuration;

  return (
    <motion.main
      id="invitation-top"
      className="invitation-page"
      initial={{ backgroundColor: "#24231f" }}
      animate={{ backgroundColor: "#f2efe8" }}
      transition={{ duration: backgroundDuration, ease: CINEMATIC_ENTRY_EASE }}
    >
      <p className="sr-only" role="status" aria-live="polite">
        Access opened. Spain Residency invitation.
      </p>

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
            aria-label="Origen — back to the top"
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

          <p className="invitation-availability">
            <span aria-hidden="true" />
            10 spots available
          </p>
        </header>

        <section className="invitation-hero" aria-labelledby="residency-title">
          <div className="invitation-title-block">
            <p className="invitation-eyebrow">Origen presents</p>
            <h1 id="residency-title">
              <span>Spain</span>
              <span>Residency</span>
            </h1>
          </div>

          <dl className="invitation-details">
            <div>
              <dt>Duration</dt>
              <dd>5 days</dd>
            </div>
            <div>
              <dt>Dates</dt>
              <dd aria-label="September 9 to 14">09—14 Sept</dd>
            </div>
            <div>
              <dt>Place</dt>
              <dd>Liencres, Spain</dd>
            </div>
          </dl>
        </section>

        <section className="invitation-program" aria-labelledby="program-title">
          <div className="invitation-program-heading">
            <p>Five days together</p>
            <h2 id="program-title">The residency</h2>
          </div>

          <ol className="invitation-experiences">
            {experiences.map((experience, index) => (
              <li key={experience}>
                <span aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {experience}
              </li>
            ))}
          </ol>
        </section>

        <nav className="invitation-links" aria-label="Residency links">
          <a href={SPACE_URL} target="_blank" rel="noreferrer">
            <span>
              <small>Stay</small>
              Space
            </span>
            <span aria-hidden="true">↗</span>
          </a>
          <a href={MAPS_URL} target="_blank" rel="noreferrer">
            <span>
              <small>Liencres, Spain</small>
              Maps
            </span>
            <span aria-hidden="true">↗</span>
          </a>
        </nav>

        <footer className="invitation-footer">
          <p>Origen · Liencres</p>
          <p>09—14 September</p>
        </footer>

        {development && onReset ? (
          <button
            className="session-reset invitation-session-reset"
            type="button"
            onClick={onReset}
          >
            reset session
          </button>
        ) : null}
      </motion.div>
    </motion.main>
  );
}
