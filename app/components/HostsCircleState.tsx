"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";
import { GatewayBrandLink } from "./GatewayBrandLink";
import { InstagramLink } from "./InstagramLink";
import { LanguageToggle, usePersistentLanguage } from "./LanguageToggle";
import { HOSTS_CIRCLE_COPY, HOSTS_CIRCLE_SCHEDULE } from "../lib/hosts-circle";
import type { Language } from "../lib/language";
import { CINEMATIC_ENTRY_EASE, GATEWAY_MOTION } from "../lib/gateway-motion";

export function HostsCircleState({ initialLanguage }: { initialLanguage: Language }) {
  const { language, changeLanguage } = usePersistentLanguage(initialLanguage);
  const copy = HOSTS_CIRCLE_COPY[language];
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    document.title = copy.title;
  }, [copy.title]);

  return (
    <motion.main
      className="bros-page hosts-circle-page"
      lang={language}
      id="hosts-top"
      initial={{ backgroundColor: "#24231f" }}
      animate={{ backgroundColor: "#151411" }}
      transition={{
        duration: reducedMotion ? GATEWAY_MOTION.opened.reducedBackgroundDuration : GATEWAY_MOTION.opened.backgroundDuration,
        ease: CINEMATIC_ENTRY_EASE,
      }}
    >
      <p className="sr-only" role="status" aria-live="polite">{copy.accessGranted}</p>
      <div className="invitation-texture bros-texture" aria-hidden="true" />
      <div className="bros-content">
        <header className="bros-header">
          <GatewayBrandLink className="bros-brand" label={copy.back} />
          <div className="hosts-header-actions">
            <p>{copy.header}</p>
            <LanguageToggle language={language} onChange={changeLanguage} />
          </div>
        </header>

        <section className="bros-hero" aria-labelledby="hosts-title">
          <div className="bros-hero-title">
            <p>{copy.values}</p>
            <h1 id="hosts-title"><span>Origen</span><span>Hosts</span></h1>
          </div>
          <div className="bros-hero-aside">
            <p>{copy.hero}</p>
            <p className="bros-place">{copy.cadence}<br /><time dateTime={HOSTS_CIRCLE_SCHEDULE.time}>{copy.shortTime}</time> · {copy.timeZoneLabel}</p>
            <a className="bros-primary-action" href="#join">{copy.heroAction}<span className="external-link-dot" aria-hidden="true" /></a>
          </div>
        </section>

        <section className="bros-manifesto scroll-reveal" aria-labelledby="hosts-manifesto">
          <h2 id="hosts-manifesto">{copy.manifestoTitle}</h2>
          <div className="bros-manifesto-copy">
            {copy.manifestoLines.map((line, index) => (
              <p key={line} className={index === 2 ? "bros-manifesto-turn" : undefined}>{line}</p>
            ))}
            {copy.manifestoBody.map((paragraph) => <p key={paragraph} className="hosts-manifesto-body">{paragraph}</p>)}
          </div>
        </section>

        <section className="hosts-meeting scroll-reveal" aria-labelledby="hosts-meeting-title">
          <div className="bros-section-heading">
            <p>{copy.meetingEyebrow}</p>
            <h2 id="hosts-meeting-title">{copy.meetingTitle[0]}<br />{copy.meetingTitle[1]}</h2>
          </div>
          <div>
            <dl className="hosts-meeting-facts">
              <div><dt>{copy.when}</dt><dd>{copy.cadence}</dd></div>
              <div><dt>{copy.time}</dt><dd><time dateTime={HOSTS_CIRCLE_SCHEDULE.time}>{language === "en" ? "5pm / 17:00" : "17:00"}</time><span>{copy.timeZoneLabel} · {HOSTS_CIRCLE_SCHEDULE.timeZone}</span></dd></div>
              <div><dt>{copy.where}</dt><dd>{copy.online}<span>{copy.meetingDetails}</span></dd></div>
            </dl>
            <p className="hosts-time-note">{copy.timeNote}</p>
          </div>
        </section>

        <section className="bros-circle" id="monthly-circle" aria-labelledby="hosts-flow-title">
          <div className="bros-section-heading scroll-reveal">
            <p>{copy.flowEyebrow}</p>
            <h2 id="hosts-flow-title">{copy.flowTitle}</h2>
          </div>
          <div className="bros-circle-content">
            <p className="bros-circle-schedule scroll-reveal">{copy.flowIntro}</p>
            <ol className="bros-practices scroll-reveal-list">
              {copy.flow.map((step, index) => (
                <li key={index}>
                  <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="hosts-step-duration">{step.minutes} {copy.minutes}</p>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                    <p className="hosts-step-prompt">{step.prompt}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bros-intentions" aria-labelledby="hosts-for-title">
          <div className="bros-section-heading scroll-reveal">
            <p>{copy.forEyebrow}</p>
            <h2 id="hosts-for-title">{copy.forTitle}</h2>
          </div>
          <ol className="scroll-reveal-list">
            {copy.intentions.map((intention, index) => (
              <li key={index}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><p>{intention}</p></li>
            ))}
          </ol>
        </section>

        <section className="bros-agreements" aria-labelledby="hosts-agreements-title">
          <div className="bros-section-heading scroll-reveal">
            <p>{copy.agreementsEyebrow}</p>
            <h2 id="hosts-agreements-title">{copy.agreementsTitle}</h2>
          </div>
          <dl className="scroll-reveal-list">
            {copy.agreements.map(([heading, body], index) => (
              <div key={index}>
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <dt>{heading}</dt><dd>{body}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="hosts-prepare" aria-labelledby="hosts-prepare-title">
          <div className="bros-section-heading scroll-reveal">
            <p>{copy.prepareEyebrow}</p>
            <h2 id="hosts-prepare-title">{copy.prepareTitle}</h2>
          </div>
          <ol className="scroll-reveal-list">
            {copy.prepare.map(([heading, body], index) => (
              <li key={index}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><h3>{heading}</h3><p>{body}</p></li>
            ))}
          </ol>
        </section>

        <section className="bros-needs scroll-reveal" id="join" aria-labelledby="hosts-join-title">
          <p>{copy.joinEyebrow}</p>
          <div>
            <h2 id="hosts-join-title">{copy.joinTitle}</h2>
            <p>{copy.joinBody}</p>
            <button className="hosts-join-link" type="button" disabled aria-describedby="hosts-form-note">
              {copy.formPending}<span className="external-link-dot" aria-hidden="true" />
            </button>
            <p className="hosts-join-note" id="hosts-form-note">{copy.formNote}</p>
          </div>
        </section>
        <footer className="bros-footer hosts-footer">
          <p>Origen Hosts · {copy.values}</p>
          <Link href={copy.venueHref}>{copy.venueLink}<span className="external-link-dot" aria-hidden="true" /></Link>
        </footer>
        <InstagramLink />
      </div>
    </motion.main>
  );
}
