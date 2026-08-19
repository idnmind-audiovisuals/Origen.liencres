"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useLayoutEffect, useRef } from "react";
import { ORIGEN_WORDMARK_ASSET } from "../lib/brand";
import {
  CINEMATIC_ENTRY_EASE,
  GATEWAY_MOTION,
} from "../lib/gateway-motion";

type BrosStateProps = {
  development: boolean;
  onReset?: () => void;
};

const TYPEFORM_URL = "https://form.typeform.com/to/AItAiCHI";
const WHATSAPP_URL =
  "https://chat.whatsapp.com/F7Yg8F7zx1R3jA5ltgvKwS?s=cl&p=i&mlu=4";

const MANIFESTO = [
  "No para competir.",
  "No para impresionar.",
  "No para tener todas las respuestas.",
  "Sino otras personas con las que podamos ser reales entre nosotros.",
  "Un espacio para expresar con honestidad, escuchar profundamente y explorar qué significa ser.",
  "Un lugar para la vulnerabilidad, la responsabilidad, los desafíos y el apoyo.",
  "Sin máscaras.",
  "Simplemente hombres encontrándose con otros hombres.",
] as const;

const CIRCLE_PRACTICES = [
  {
    title: "Compartir",
    body: [
      "Hablar sinceramente de lo que realmente está ocurriendo en nuestras vidas.",
      "Escuchar sin juzgar y aprender a apoyarnos unos a otros.",
    ],
  },
  {
    title: "Retos",
    body: [
      "Estar dispuestos a ver aquello que quizá no podemos ver solos.",
      "Hacernos responsables de cómo vivimos, amamos y nos presentamos ante la vida.",
    ],
  },
  {
    title: "Embodyment",
    body: [
      "Movimiento, respiración, silencio, conexión y prácticas que nos devuelven al cuerpo.",
    ],
  },
] as const;

const INTENTIONS = [
  "Relaciones más profundas con otros hombres.",
  "Más honestidad en sus relaciones.",
  "Una conexión más fuerte consigo mismos.",
  "Explorar la masculinidad más allá de estereotipos.",
  "Ser retados sin ser juzgados.",
  "Vivir con más presencia, responsabilidad y vitalidad.",
  "Y contar con un grupo de hombres en quienes realmente puedan apoyarse.",
] as const;

const AGREEMENTS = [
  {
    title: "Responsabilidad",
    body: "Nos hacemos cargo de nuestras emociones, decisiones y acciones.",
  },
  {
    title: "Respeto",
    body: "Cada hombre es responsable de sus propios límites y de respetar los de los demás.",
  },
  {
    title: "Desafío",
    body: "Nos retamos desde el cuidado, no desde la superioridad.",
  },
  {
    title: "Confidencialidad",
    body: "Si se pide, lo que se comparte en el círculo se queda en el círculo.",
  },
  {
    title: "Sinceridad",
    body: "Practicamos decir lo que es real.",
  },
  {
    title: "Presencia",
    body: "Escuchamos antes de intentar solucionar.",
  },
] as const;

export function BrosState({ development, onReset }: BrosStateProps) {
  const pageRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const backgroundDuration = reducedMotion
    ? GATEWAY_MOTION.opened.reducedBackgroundDuration
    : GATEWAY_MOTION.opened.backgroundDuration;
  const contentDelay = reducedMotion ? 0 : GATEWAY_MOTION.opened.textDelay;

  useLayoutEffect(() => {
    if (!pageRef.current) return;
    pageRef.current.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  useEffect(() => {
    document.documentElement.lang = "es";
    document.title = "Origen Bros — Liencres";
  }, []);

  return (
    <motion.main
      ref={pageRef}
      id="bros-top"
      className="bros-page"
      lang="es"
      initial={{ backgroundColor: "#24231f" }}
      animate={{ backgroundColor: "#151411" }}
      transition={{ duration: backgroundDuration, ease: CINEMATIC_ENTRY_EASE }}
    >
      <p className="sr-only" role="status" aria-live="polite">
        Acceso concedido. Bienvenido a Origen Bros.
      </p>

      <motion.div
        className="invitation-texture bros-texture"
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
        className="bros-content"
        initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: contentDelay,
          duration: reducedMotion ? 0.08 : GATEWAY_MOTION.opened.textDuration,
          ease: CINEMATIC_ENTRY_EASE,
        }}
      >
        <header className="bros-header">
          <a
            className="bros-brand"
            href="#bros-top"
            aria-label="Origen Bros — volver al inicio"
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
          </a>
          <p>Círculo de hombres · Liencres</p>
        </header>

        <section className="bros-hero" aria-labelledby="bros-title">
          <div className="bros-hero-title">
            <p>Presencia · Responsabilidad · Crecimiento</p>
            <h1 id="bros-title">
              <span>Origen</span>
              <span>Bros</span>
            </h1>
          </div>
          <div className="bros-hero-aside">
            <p>Un espacio para reunirse en autenticidad.</p>
            <p className="bros-place">Liencres, Cantabria</p>
            <a href={TYPEFORM_URL} target="_blank" rel="noreferrer">
              Unirme al círculo <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>

        <section className="bros-manifesto" aria-labelledby="manifesto-title">
          <h2 id="manifesto-title">Necesitamos a otros.</h2>
          <div className="bros-manifesto-copy">
            {MANIFESTO.map((paragraph, index) => (
              <p
                key={paragraph}
                className={index === 3 ? "bros-manifesto-turn" : undefined}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        <section className="bros-circle" aria-labelledby="circle-title">
          <div className="bros-section-heading">
            <p>Encuentros regulares</p>
            <h2 id="circle-title">El círculo</h2>
          </div>
          <div className="bros-circle-content">
            <p className="bros-circle-schedule">
              Nos reunimos regularmente en Liencres. Cada dos semanas, de 19:00
              a 21:00. Cada círculo tendrá diferentes temáticas, pero una
              estructura similar:
            </p>
            <ol className="bros-practices">
              {CIRCLE_PRACTICES.map((practice, index) => (
                <li key={practice.title}>
                  <span aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3>{practice.title}</h3>
                    {practice.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bros-intentions" aria-labelledby="intentions-title">
          <div className="bros-section-heading">
            <p>Este espacio es para</p>
            <h2 id="intentions-title">Personas que quieren</h2>
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
        </section>

        <section className="bros-agreements" aria-labelledby="agreements-title">
          <div className="bros-section-heading">
            <p>Cómo nos encontramos</p>
            <h2 id="agreements-title">Nuestros acuerdos</h2>
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
        </section>

        <section className="bros-needs" aria-labelledby="needs-title">
          <p>Necesidades</p>
          <div>
            <h2 id="needs-title">No necesitas tenerlo todo resuelto.</h2>
            <p>No necesitas experiencia previa en círculos de hombres.</p>
            <p>
              Solo necesitas la disposición de presentarte con honestidad.
            </p>
          </div>
        </section>

        <nav className="bros-actions" aria-label="Solicitudes para Origen Bros">
          <a href={TYPEFORM_URL} target="_blank" rel="noreferrer">
            <small>Formulario Typeform</small>
            <strong>Aplication</strong>
            <span aria-hidden="true">↗</span>
          </a>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
            <small>Grupo privado</small>
            <strong>Solicitar acceso al grupo de WhatsApp</strong>
            <span aria-hidden="true">↗</span>
          </a>
        </nav>

        <footer className="bros-footer">
          <p>Origen Bros</p>
          <p>Liencres · Cantabria</p>
        </footer>

        {development && onReset ? (
          <button
            className="session-reset bros-session-reset"
            type="button"
            onClick={onReset}
          >
            reiniciar sesión
          </button>
        ) : null}
      </motion.div>
    </motion.main>
  );
}
