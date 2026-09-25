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

type EmpoderateStateProps = {
  development: boolean;
  onReset?: () => void;
};

const DIMENSIONS = [
  ["Cuerpo", "Movimiento · Fuerza · Presencia"],
  ["Mente", "Creencias · Claridad · Decisiones"],
  ["Emociones", "Vulnerabilidad · Miedo · Deseo"],
  ["Relaciones", "Hombres · Pareja · Comunicación"],
  ["Propósito", "Trabajo · Dinero · Dirección · Acción"],
] as const;

const JOURNEY = [
  {
    day: "Viernes",
    title: "Conectar",
    lines: ["Llegar.", "Conocernos.", "Bajar las defensas.", "Crear confianza."],
  },
  {
    day: "Sábado",
    title: "Atravesar",
    lines: [
      "Movimiento.",
      "Desafío.",
      "Cuerpo.",
      "Emociones.",
      "Relaciones.",
      "Fuego.",
      "Conversaciones reales.",
    ],
  },
  {
    day: "Domingo",
    title: "Integrar",
    lines: ["Yoga.", "Meditación.", "Propósito.", "Objetivos.", "Mastermind.", "Dirección."],
  },
] as const;

const HOUSE_IMAGES = [
  {
    src: "/origen-rebros-bedroom.jpg",
    alt: "Dormitorio de la casa Origen en Liencres",
  },
  {
    src: "https://a0.muscache.com/im/pictures/hosting/Hosting-23250801/original/3b1e8c34-f170-45e9-8ebe-d880261a3235.jpeg?im_w=720",
    alt: "Espacio compartido de Origen Liencres",
  },
  {
    src: "/origen-rebros-house-exterior.avif",
    alt: "Vista exterior de la casa Origen en Liencres al atardecer",
  },
] as const;

const QUESTIONS = [
  "¿Qué quiero realmente?",
  "¿Cómo quiero relacionarme?",
  "¿Qué clase de hombre quiero ser?",
  "¿Hacia dónde estoy llevando mi vida?",
] as const;

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      className={`empower-text-reveal ${className}`.trim()}
      initial={reducedMotion ? false : { opacity: 0, y: 72, filter: "blur(9px)" }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{ duration: 1.25, ease: CINEMATIC_ENTRY_EASE }}
    >
      {children}
    </motion.div>
  );
}

export function EmpoderateState({ development, onReset }: EmpoderateStateProps) {
  const pageRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ container: pageRef });
  const heroImageOffset = useTransform(scrollYProgress, [0, 0.2], [0, 110]);
  const heroImageY = useSpring(heroImageOffset, {
    stiffness: 42,
    damping: 28,
    mass: 1.1,
  });
  const progressScale = useSpring(scrollYProgress, {
    stiffness: 75,
    damping: 25,
    mass: 0.45,
  });
  const backgroundDuration = reducedMotion
    ? GATEWAY_MOTION.opened.reducedBackgroundDuration
    : GATEWAY_MOTION.opened.backgroundDuration;
  const contentDelay = reducedMotion ? 0 : GATEWAY_MOTION.opened.textDelay;

  useLayoutEffect(() => {
    if (pageRef.current) pageRef.current.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  useEffect(() => {
    document.documentElement.lang = "es";
    document.title = "BROS — Retiro de hombres | Origen Liencres";
  }, []);

  return (
    <motion.main
      ref={pageRef}
      className="empower-page"
      lang="es"
      initial={{ backgroundColor: "#24231f" }}
      animate={{ backgroundColor: "#151411" }}
      transition={{ duration: backgroundDuration, ease: CINEMATIC_ENTRY_EASE }}
    >
      <p className="sr-only" role="status" aria-live="polite">
        Acceso concedido. Bienvenido al retiro BROS.
      </p>

      {!reducedMotion ? (
        <motion.div
          className="empower-progress"
          aria-hidden="true"
          style={{ scaleX: progressScale }}
        />
      ) : null}

      <motion.header
        className="empower-header"
        initial={reducedMotion ? false : { opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: reducedMotion ? 0 : contentDelay * 0.55,
          duration: reducedMotion ? 0.08 : 0.9,
          ease: CINEMATIC_ENTRY_EASE,
        }}
      >
        <GatewayBrandLink
          className="empower-brand"
          label="Origen — volver al acceso"
        />
        <p>BROS × ORIGEN</p>
        {development && onReset ? (
          <button type="button" onClick={onReset}>Cerrar</button>
        ) : null}
      </motion.header>

      <section className="empower-hero" aria-labelledby="empower-title">
        <motion.div
          className="empower-hero-media"
          aria-hidden="true"
          style={reducedMotion ? undefined : { y: heroImageY }}
        />
        <div className="empower-hero-shade" aria-hidden="true" />
        <motion.div
          className="empower-hero-copy"
          initial={reducedMotion ? false : { opacity: 0, y: 34, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            delay: contentDelay,
            duration: reducedMotion ? 0.08 : 1.2,
            ease: CINEMATIC_ENTRY_EASE,
          }}
        >
          <p className="empower-kicker">RETIRO DE HOMBRES</p>
          <h1 id="empower-title">BROS</h1>
          <p className="empower-intro">
            Tres días entre hombres para salir del ruido, conocerte mejor y
            volver con más claridad sobre cómo quieres vivir.
          </p>
          <div className="empower-hero-meta">
            <span>Liencres · Cantabria</span>
            <span>20, 21, 22 SEPT · 7 PLAZAS SELECTAS</span>
          </div>
          <a className="empower-button empower-button--light" href="#solicitud">
            Solicitar plaza
            <i className="external-link-dot" aria-hidden="true" />
          </a>
        </motion.div>
      </section>

      <section className="empower-moment empower-shell" aria-labelledby="moment-title">
        <Reveal className="empower-moment-lead">
          <p className="empower-eyebrow">El momento</p>
          <h2 id="moment-title">
            Sabes que puede haber algo más
            <span>y que todo empieza por tu masculinidad.</span>
          </h2>
        </Reveal>
        <div className="empower-moment-grid">
          <Reveal className="empower-everyday">
            <p>Tienes el trabajo. Amigos. Proyectos.</p>
            <p>Entrenas. Viajas. Pero...</p>
          </Reveal>
          <div className="empower-questions">
            {QUESTIONS.map((question, index) => (
              <motion.p
                key={question}
                initial={reducedMotion ? false : { opacity: 0, x: 30, filter: "blur(7px)" }}
                whileInView={reducedMotion ? undefined : { opacity: 1, x: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8, delay: index * 0.08, ease: CINEMATIC_ENTRY_EASE }}
              >
                {question}
              </motion.p>
            ))}
          </div>
        </div>
        <Reveal className="empower-moment-close">
          BROS es un espacio para parar y explorar esas preguntas junto a otros hombres.
        </Reveal>
      </section>

      <section className="empower-experience" aria-labelledby="experience-title">
        <div className="empower-shell">
          <Reveal className="empower-section-heading">
            <p className="empower-eyebrow">La experiencia</p>
            <h2 id="experience-title">Tres días. Siete hombres.</h2>
          </Reveal>
          <div className="empower-dimensions">
            {DIMENSIONS.map(([title, body], index) => (
              <motion.article
                key={title}
                initial={reducedMotion ? false : { opacity: 0, y: 44, filter: "blur(7px)" }}
                whileInView={reducedMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.36 }}
                transition={{ duration: 0.9, delay: index * 0.06, ease: CINEMATIC_ENTRY_EASE }}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="empower-journey empower-shell" aria-labelledby="journey-title">
        <Reveal className="empower-section-heading">
          <p className="empower-eyebrow">El viaje</p>
          <h2 id="journey-title">Llegar. Atravesar. Volver.</h2>
        </Reveal>
        <div className="empower-days">
          {JOURNEY.map((day, index) => (
            <Reveal key={day.day} className="empower-day">
              <span>0{index + 1} · {day.day}</span>
              <h3>{day.title}</h3>
              <p>{day.lines.join(" ")}</p>
              {day.day === "Domingo" ? (
                <strong>Volver a casa con algo concreto que llevar a tu vida.</strong>
              ) : null}
            </Reveal>
          ))}
        </div>
      </section>

      <section className="empower-bros" aria-labelledby="bros-philosophy-title">
        <div className="empower-bros-overlay" aria-hidden="true" />
        <Reveal className="empower-bros-copy">
          <p className="empower-eyebrow">BROS</p>
          <h2 id="bros-philosophy-title">Queremos hombres normales viviendo algo extraordinario.</h2>
          <p>Venimos a crear un espacio donde podamos explorar lo que significa ser un hombre juntos.</p>
          <p className="empower-bros-plain">Sin personajes. Sin gurús. Sin postureo espiritual.</p>
          <p>
            Hombres siendo hombres, hablando sobre cosas de las que normalmente
            no hablamos. Compitiendo, jugando y amándonos.
          </p>
        </Reveal>
      </section>

      <section className="empower-place empower-shell" aria-labelledby="place-title">
        <Reveal className="empower-place-copy">
          <p className="empower-eyebrow">El lugar</p>
          <h2 id="place-title">Origen</h2>
          <p className="empower-place-lead">Entre el mar y los acantilados de Costa Quebrada.</p>
          <p>Durante tres días, este espacio será nuestra casa.</p>
          <p className="empower-place-rhythm">Naturaleza. Fuego. Movimiento. Conversación. Comida compartida. Silencio.</p>
          <strong>Liencres · Cantabria</strong>
        </Reveal>
        <div className="empower-gallery">
          {HOUSE_IMAGES.map((image, index) => (
            <motion.figure
              key={image.src}
              className={`empower-gallery-item empower-gallery-item--${index + 1}`}
              initial={reducedMotion ? false : { opacity: 0, y: 60 }}
              whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1.1, delay: index * 0.08, ease: CINEMATIC_ENTRY_EASE }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.src} alt={image.alt} loading="lazy" />
            </motion.figure>
          ))}
        </div>
      </section>

      <section className="empower-seven" aria-labelledby="seven-title">
        <Reveal className="empower-seven-inner">
          <p className="empower-seven-number" aria-hidden="true">7</p>
          <div>
            <h2 id="seven-title">Grupo selecto de 7 personas.</h2>
            <p>
              Serán seleccionadas únicamente siete personas con un perfil
              extraordinario para poder profundizar y vivir una experiencia única.
            </p>
            <a className="empower-button empower-button--light" href="#solicitud">
              Quiero formar parte
              <i className="external-link-dot" aria-hidden="true" />
            </a>
          </div>
        </Reveal>
      </section>

      <section className="empower-information empower-shell" aria-labelledby="info-title">
        <Reveal className="empower-info-title">
          <p className="empower-eyebrow">Información</p>
          <h2 id="info-title">BROS</h2>
          <p>BROS × ORIGEN</p>
        </Reveal>
        <Reveal className="empower-info-list">
          <dl>
            <div><dt>Lugar</dt><dd>Origen Liencres · Cantabria</dd></div>
            <div><dt>Fechas</dt><dd>20, 21 y 22 de septiembre</dd></div>
            <div><dt>Duración</dt><dd>Viernes — Domingo</dd></div>
            <div><dt>Grupo</dt><dd>7 plazas selectas</dd></div>
            <div><dt>Incluye</dt><dd>Alojamiento y comidas</dd></div>
            <div><dt>Acuerdo</dt><dd>Sin alcohol ni drogas</dd></div>
            <div><dt>Precio</dt><dd>555 €</dd></div>
          </dl>
          <a className="empower-button" href="#solicitud">
            Solicitar plaza
            <i className="external-link-dot" aria-hidden="true" />
          </a>
        </Reveal>
      </section>

      <section id="solicitud" className="empower-application" aria-labelledby="application-title">
        <div className="empower-shell empower-application-grid">
          <Reveal className="empower-application-intro">
            <p className="empower-eyebrow">Solicitud</p>
            <h2 id="application-title">¿Te llama?</h2>
            <p>No queremos llenar plazas sin más.</p>
            <p>Queremos crear un grupo que tenga sentido.</p>
            <strong>Solo 7 plazas.</strong>
          </Reveal>
          <Reveal className="empower-form-wrap">
            <form className="empower-form" aria-describedby="empower-form-note">
              <div className="empower-form-row">
                <label>Nombre<input name="name" autoComplete="name" required /></label>
                <label>Edad<input name="age" inputMode="numeric" required /></label>
              </div>
              <div className="empower-form-row">
                <label>Ciudad<input name="city" autoComplete="address-level2" required /></label>
                <label>WhatsApp / Email<input name="contact" autoComplete="email" required /></label>
              </div>
              <label>¿A qué te dedicas?<textarea name="work" rows={2} required /></label>
              <label>¿Qué momento estás viviendo?<textarea name="moment" rows={3} required /></label>
              <label>¿Qué te gustaría explorar durante estos tres días?<textarea name="explore" rows={3} required /></label>
              <label>¿Por qué te interesa este retiro?<textarea name="why" rows={3} required /></label>
              <button type="button" disabled aria-describedby="empower-form-note">
                Enviar solicitud
                <i className="external-link-dot" aria-hidden="true" />
              </button>
              <p id="empower-form-note">Formulario de solicitud próximamente.</p>
            </form>
          </Reveal>
        </div>
      </section>

      <section className="empower-closing" aria-labelledby="closing-title">
        <div className="empower-closing-shade" aria-hidden="true" />
        <Reveal className="empower-closing-copy">
          <h2 id="closing-title">No necesitas tener todas las respuestas.</h2>
          <p>Quizá solo necesitas el espacio para vivirlas.</p>
          <strong>EMPODERA</strong>
          <span className="empower-closing-subtitle">Tu masculinidad</span>
          <span className="empower-closing-meta">BROS × ORIGEN · LIENCRES · CANTABRIA</span>
          <a className="empower-button empower-button--light" href="#solicitud">
            Solicitar plaza
            <i className="external-link-dot" aria-hidden="true" />
          </a>
        </Reveal>
      </section>

      <footer className="empower-footer">
        <span>BROS × ORIGEN</span>
        <InstagramLink />
        <span>Liencres · Cantabria</span>
      </footer>
    </motion.main>
  );
}
