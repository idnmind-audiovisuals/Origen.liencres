"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useLayoutEffect, useRef } from "react";
import { GatewayBrandLink } from "./GatewayBrandLink";
import { InstagramLink } from "./InstagramLink";
import {
  CINEMATIC_ENTRY_EASE,
  GATEWAY_MOTION,
} from "../lib/gateway-motion";

type BrosStateProps = {
  development: boolean;
  onReset?: () => void;
};

const APPLICATION_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSd2uhreU_NDgC3-H9wOfcsP2w9Q_lixIq4Er_BsEMTTNB7W5g/viewform";
const WHATSAPP_URL =
  "https://chat.whatsapp.com/F7Yg8F7zx1R3jA5ltgvKwS?s=cl&p=i&mlu=4";

const MANIFESTO = [
  "No para competir.",
  "No para impresionar.",
  "No para tener todas las respuestas.",
  "Sino otras personas con las que podamos ser reales entre nosotros.",
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
  const { scrollYProgress } = useScroll({ container: pageRef });
  const heroOffset = useTransform(scrollYProgress, [0, 0.3], [0, 96]);
  const heroY = useSpring(heroOffset, {
    stiffness: 38,
    damping: 26,
    mass: 1.15,
  });
  const progressScale = useSpring(scrollYProgress, {
    stiffness: 72,
    damping: 24,
    mass: 0.45,
  });
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
    document.title = "Círculo de hombres — Origen";
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

      {!reducedMotion ? (
        <motion.div
          className="bros-scroll-progress"
          aria-hidden="true"
          style={{ scaleX: progressScale }}
        />
      ) : null}

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
          <GatewayBrandLink
            className="bros-brand"
            label="Origen Bros — volver al acceso"
          />
          <p>Círculo de hombres · Liencres</p>
        </header>

        <motion.section
          className="bros-hero"
          aria-labelledby="bros-title"
          style={reducedMotion ? undefined : { y: heroY }}
        >
          <div className="bros-hero-title">
            <p>Presencia · Responsabilidad · Crecimiento</p>
            <h1 id="bros-title">
              <span>Origen</span>
              <span>Bros</span>
            </h1>
          </div>
          <div className="bros-hero-aside">
            <p>Un espacio de autenticidad para hombres.</p>
            <p className="bros-place">Liencres, Cantabria</p>
            <a
              className="bros-primary-action"
              href={APPLICATION_FORM_URL}
              target="_blank"
              rel="noreferrer"
            >
              UNIRME
              <span className="external-link-dot" aria-hidden="true" />
            </a>
          </div>
        </motion.section>

        <motion.section
          className="bros-manifesto bros-section-reveal"
          aria-labelledby="manifesto-title"
          initial={reducedMotion ? false : { opacity: 0, y: 72 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.18, root: pageRef }}
          transition={{ duration: 1.25, ease: CINEMATIC_ENTRY_EASE }}
        >
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
        </motion.section>

        <motion.section
          className="bros-circle bros-section-reveal"
          aria-labelledby="circle-title"
          initial={reducedMotion ? false : { opacity: 0, y: 72 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12, root: pageRef }}
          transition={{ duration: 1.3, ease: CINEMATIC_ENTRY_EASE }}
        >
          <div className="bros-section-heading">
            <p>Encuentros regulares</p>
            <h2 id="circle-title">El círculo</h2>
          </div>
          <div className="bros-circle-content">
            <p className="bros-circle-schedule">
              Nos reunimos regularmente cada semana (Para el horario exacto,
              confirma en el group). Y cada círculo tendrá diferentes
              temáticas, pero una estructura similar:
            </p>
            <ol className="bros-practices">
              {CIRCLE_PRACTICES.map((practice, index) => (
                <motion.li
                  key={practice.title}
                  initial={reducedMotion ? false : { opacity: 0, y: 48 }}
                  whileInView={
                    reducedMotion ? undefined : { opacity: 1, y: 0 }
                  }
                  viewport={{ once: true, amount: 0.32, root: pageRef }}
                  transition={{
                    duration: 1.05,
                    delay: index * 0.1,
                    ease: CINEMATIC_ENTRY_EASE,
                  }}
                >
                  <span aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3>{practice.title}</h3>
                    {practice.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </motion.section>

        <motion.section
          className="bros-intentions bros-section-reveal"
          aria-labelledby="intentions-title"
          initial={reducedMotion ? false : { opacity: 0, y: 72 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1, root: pageRef }}
          transition={{ duration: 1.3, ease: CINEMATIC_ENTRY_EASE }}
        >
          <div className="bros-section-heading">
            <p>Este espacio es para</p>
            <h2 id="intentions-title">Personas que quieren</h2>
          </div>
          <ol>
            {INTENTIONS.map((intention, index) => (
              <motion.li
                key={intention}
                initial={reducedMotion ? false : { opacity: 0, x: -34 }}
                whileInView={
                  reducedMotion ? undefined : { opacity: 1, x: 0 }
                }
                viewport={{ once: true, amount: 0.4, root: pageRef }}
                transition={{
                  duration: 0.95,
                  delay: Math.min(index * 0.055, 0.22),
                  ease: CINEMATIC_ENTRY_EASE,
                }}
              >
                <span aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p>{intention}</p>
              </motion.li>
            ))}
          </ol>
        </motion.section>

        <motion.section
          className="bros-agreements bros-section-reveal"
          aria-labelledby="agreements-title"
          initial={reducedMotion ? false : { opacity: 0, y: 72 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1, root: pageRef }}
          transition={{ duration: 1.3, ease: CINEMATIC_ENTRY_EASE }}
        >
          <div className="bros-section-heading">
            <p>Cómo nos encontramos</p>
            <h2 id="agreements-title">Nuestros acuerdos</h2>
          </div>
          <dl>
            {AGREEMENTS.map((agreement, index) => (
              <motion.div
                key={agreement.title}
                initial={reducedMotion ? false : { opacity: 0, y: 38 }}
                whileInView={
                  reducedMotion ? undefined : { opacity: 1, y: 0 }
                }
                viewport={{ once: true, amount: 0.4, root: pageRef }}
                transition={{
                  duration: 0.95,
                  delay: Math.min(index * 0.06, 0.2),
                  ease: CINEMATIC_ENTRY_EASE,
                }}
              >
                <span aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <dt>{agreement.title}</dt>
                <dd>{agreement.body}</dd>
              </motion.div>
            ))}
          </dl>
        </motion.section>

        <motion.section
          className="bros-needs bros-section-reveal"
          aria-labelledby="needs-title"
          initial={reducedMotion ? false : { opacity: 0, y: 72 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.18, root: pageRef }}
          transition={{ duration: 1.3, ease: CINEMATIC_ENTRY_EASE }}
        >
          <p>Necesidades</p>
          <div>
            <h2 id="needs-title">No necesitas tenerlo todo resuelto.</h2>
            <p>No necesitas experiencia previa en círculos de hombres.</p>
            <p>
              Solo necesitas la disposición de presentarte con honestidad.
            </p>
          </div>
        </motion.section>

        <motion.nav
          className="bros-actions bros-section-reveal"
          aria-label="Solicitudes para Origen Bros"
          initial={reducedMotion ? false : { opacity: 0, y: 64 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2, root: pageRef }}
          transition={{ duration: 1.3, ease: CINEMATIC_ENTRY_EASE }}
        >
          <motion.a
            href={APPLICATION_FORM_URL}
            target="_blank"
            rel="noreferrer"
            whileHover={reducedMotion ? undefined : { y: -6 }}
            transition={{ duration: 0.45, ease: CINEMATIC_ENTRY_EASE }}
          >
            <small>Formulario Google</small>
            <strong>Aplication</strong>
            <span className="external-link-dot" aria-hidden="true" />
          </motion.a>
          <motion.a
            className="bros-whatsapp-action"
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            whileHover={reducedMotion ? undefined : { y: -6 }}
            transition={{ duration: 0.45, ease: CINEMATIC_ENTRY_EASE }}
          >
            <strong>Solicitar acceso</strong>
            <span className="external-link-dot" aria-hidden="true" />
          </motion.a>
        </motion.nav>

        <footer className="bros-footer">
          <p>Origen Bros</p>
          <p>Liencres · Cantabria</p>
        </footer>

        <InstagramLink />

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
