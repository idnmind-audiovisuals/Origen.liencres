"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { useEffect, useLayoutEffect, useRef } from "react";
import { CINEMATIC_ENTRY_EASE, GATEWAY_MOTION } from "../lib/gateway-motion";
import { GatewayBrandLink } from "./GatewayBrandLink";
import { InstagramLink } from "./InstagramLink";

const CONTACT_URL =
  "https://chat.whatsapp.com/KW3qQoKiLUk4LZIA0xZD5E?s=cl&p=i&mlu=0";

const PRACTICES = [
  {
    title: "Llegar",
    body: "Respirar, volver al cuerpo y dejar fuera el ritmo del día.",
  },
  {
    title: "Compartir",
    body: "Palabra honesta y escucha atenta, sin juicio ni necesidad de arreglar nada.",
  },
  {
    title: "Integrar",
    body: "Cerrar con una intención sencilla que puedas llevar contigo durante la semana.",
  },
] as const;

const INTENTIONS = [
  "Sentirse acompañadas por otras mujeres.",
  "Habitar el cuerpo con presencia y cuidado.",
  "Compartir lo que normalmente sostenemos en silencio.",
  "Crear vínculos honestos, suaves y reales.",
] as const;

const AGREEMENTS = [
  {
    title: "Presencia",
    body: "Llegamos sin prisa y escuchamos antes de responder.",
  },
  {
    title: "Cuidado",
    body: "Cada mujer marca sus límites y respetamos el ritmo de cada una.",
  },
  {
    title: "Confidencialidad",
    body: "Lo que se comparte en el círculo se sostiene con respeto.",
  },
  {
    title: "Honestidad",
    body: "No buscamos hacerlo perfecto; practicamos decir lo que es real.",
  },
] as const;

export function WomensCircleState() {
  const pageRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ container: pageRef });
  const progressScale = useSpring(scrollYProgress, {
    stiffness: 72,
    damping: 24,
    mass: 0.45,
  });

  useLayoutEffect(() => {
    if (!pageRef.current) return;
    pageRef.current.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  useEffect(() => {
    document.documentElement.lang = "es";
    document.title = "Círculo de mujeres — Origen Liencres";
  }, []);

  const reveal = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 68 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.14, root: pageRef },
        transition: { duration: 1.2, ease: CINEMATIC_ENTRY_EASE },
      };

  return (
    <motion.main
      ref={pageRef}
      className="bros-page women-circle-page"
      lang="es"
      initial={{ backgroundColor: "#d8b8ad" }}
      animate={{ backgroundColor: "#efd9d0" }}
      transition={{
        duration: reducedMotion
          ? GATEWAY_MOTION.opened.reducedBackgroundDuration
          : GATEWAY_MOTION.opened.backgroundDuration,
        ease: CINEMATIC_ENTRY_EASE,
      }}
    >
      {!reducedMotion ? (
        <motion.div
          className="bros-scroll-progress"
          aria-hidden="true"
          style={{ scaleX: progressScale }}
        />
      ) : null}

      <motion.div
        className="bros-texture women-circle-texture"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reducedMotion ? 0.08 : 0.9 }}
      />

      <motion.div
        className="bros-content"
        initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: reducedMotion ? 0 : 0.14,
          duration: reducedMotion ? 0.08 : 0.72,
          ease: CINEMATIC_ENTRY_EASE,
        }}
      >
        <header className="bros-header">
          <GatewayBrandLink
            className="bros-brand"
            label="Círculo de mujeres — volver a Origen"
            variant="black"
          />
          <p>Círculo de mujeres · Liencres</p>
        </header>

        <section className="bros-hero" aria-labelledby="women-circle-title">
          <div className="bros-hero-title">
            <p>Presencia · Cuidado · Expresión</p>
            <h1 id="women-circle-title">
              <span>Círculo de</span>
              <span>mujeres</span>
            </h1>
          </div>
          <div className="bros-hero-aside">
            <p>
              Un espacio íntimo para volver a ti y encontrarte con otras
              mujeres.
            </p>
            <p className="bros-place">Martes · 18:00–20:00 · Origen</p>
            <a
              className="bros-primary-action"
              href={CONTACT_URL}
              target="_blank"
              rel="noreferrer"
            >
              Quiero participar
              <span className="external-link-dot" aria-hidden="true" />
            </a>
          </div>
        </section>

        <motion.section
          className="bros-manifesto bros-section-reveal"
          aria-labelledby="women-manifesto-title"
          {...reveal}
        >
          <h2 id="women-manifesto-title">Un espacio para ti.</h2>
          <div className="bros-manifesto-copy">
            <p>Para escuchar tu cuerpo.</p>
            <p>Para dar voz a lo que sientes.</p>
            <p className="bros-manifesto-turn">
              Para compartir desde el cuidado y encontrarte con otras mujeres.
            </p>
          </div>
        </motion.section>

        <motion.section
          id="encuentro"
          className="bros-circle bros-section-reveal"
          aria-labelledby="women-meeting-title"
          {...reveal}
        >
          <div className="bros-section-heading">
            <p>Encuentro semanal</p>
            <h2 id="women-meeting-title">El círculo</h2>
          </div>
          <div className="bros-circle-content">
            <p className="bros-circle-schedule">
              Cada martes, de 18:00 a 20:00, nos encontramos en Origen para
              hacer una pausa, escucharnos y acompañarnos entre mujeres.
            </p>
            <ol className="bros-practices">
              {PRACTICES.map((practice, index) => (
                <motion.li
                  key={practice.title}
                  initial={reducedMotion ? false : { opacity: 0, y: 42 }}
                  whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3, root: pageRef }}
                  transition={{
                    duration: 0.95,
                    delay: index * 0.08,
                    ease: CINEMATIC_ENTRY_EASE,
                  }}
                >
                  <span aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3>{practice.title}</h3>
                    <p>{practice.body}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </motion.section>

        <motion.section
          className="bros-intentions bros-section-reveal"
          aria-labelledby="women-intentions-title"
          {...reveal}
        >
          <div className="bros-section-heading">
            <p>Este espacio es para</p>
            <h2 id="women-intentions-title">Mujeres que quieren</h2>
          </div>
          <ol>
            {INTENTIONS.map((intention, index) => (
              <li key={intention}>
                <span aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p>{intention}</p>
              </li>
            ))}
          </ol>
        </motion.section>

        <motion.section
          className="bros-agreements bros-section-reveal"
          aria-labelledby="women-agreements-title"
          {...reveal}
        >
          <div className="bros-section-heading">
            <p>Cómo nos encontramos</p>
            <h2 id="women-agreements-title">Nuestros acuerdos</h2>
          </div>
          <dl>
            {AGREEMENTS.map((agreement, index) => (
              <div key={agreement.title}>
                <span aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <dt>{agreement.title}</dt>
                <dd>{agreement.body}</dd>
              </div>
            ))}
          </dl>
        </motion.section>

        <motion.nav
          className="bros-actions bros-section-reveal women-circle-actions"
          aria-label="Participar en el círculo de mujeres"
          {...reveal}
        >
          <a href={CONTACT_URL} target="_blank" rel="noreferrer">
            <small>Martes · 18:00–20:00</small>
            <strong>Quiero participar</strong>
            <span className="external-link-dot" aria-hidden="true" />
          </a>
          <a href="https://www.instagram.com/origenliencres/" target="_blank" rel="noreferrer">
            <small>Origen Liencres</small>
            <strong>Conoce el espacio</strong>
            <span className="external-link-dot" aria-hidden="true" />
          </a>
          <a
            href="https://www.instagram.com/ekarapsychology/"
            target="_blank"
            rel="noreferrer"
          >
            <small>Quién sostiene</small>
            <strong>Conoce a Belén</strong>
            <span className="external-link-dot" aria-hidden="true" />
          </a>
        </motion.nav>

        <footer className="bros-footer">
          <p>Origen · Círculo de mujeres</p>
          <p>Liencres · Cantabria</p>
        </footer>

        <InstagramLink />
      </motion.div>
    </motion.main>
  );
}
