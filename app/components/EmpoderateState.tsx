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
import { CINEMATIC_ENTRY_EASE } from "../lib/gateway-motion";

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
    src: "https://a0.muscache.com/im/pictures/hosting/Hosting-23250801/original/b3c60d82-07b7-4f84-9080-c331a39599f7.png?im_w=1440",
    alt: "Origen Liencres entre el jardín y la costa de Cantabria",
  },
  {
    src: "https://a0.muscache.com/im/pictures/hosting/Hosting-23250801/original/3b1e8c34-f170-45e9-8ebe-d880261a3235.jpeg?im_w=720",
    alt: "Espacio compartido de Origen Liencres",
  },
  {
    src: "https://a0.muscache.com/im/pictures/hosting/Hosting-23250801/original/a09bcf6c-b2cd-49f4-869e-bbdb4be31da8.jpeg?im_w=720",
    alt: "Casa de Origen Liencres preparada para el grupo",
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
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y: 54 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 1.05, ease: CINEMATIC_ENTRY_EASE }}
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

  useLayoutEffect(() => {
    if (pageRef.current) pageRef.current.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  useEffect(() => {
    document.documentElement.lang = "es";
    document.title = "EMPODÉRATE — BROS × ORIGEN";
  }, []);

  return (
    <main ref={pageRef} className="empower-page" lang="es">
      <p className="sr-only" role="status" aria-live="polite">
        Acceso concedido. Bienvenido a EMPODÉRATE.
      </p>

      {!reducedMotion ? (
        <motion.div
          className="empower-progress"
          aria-hidden="true"
          style={{ scaleX: progressScale }}
        />
      ) : null}

      <header className="empower-header">
        <GatewayBrandLink
          className="empower-brand"
          label="Origen — volver al acceso"
        />
        <p>BROS × ORIGEN</p>
        {development && onReset ? (
          <button type="button" onClick={onReset}>Cerrar</button>
        ) : null}
      </header>

      <section className="empower-hero" aria-labelledby="empower-title">
        <motion.div
          className="empower-hero-media"
          aria-hidden="true"
          style={reducedMotion ? undefined : { y: heroImageY }}
        />
        <div className="empower-hero-shade" aria-hidden="true" />
        <div className="empower-hero-copy">
          <p className="empower-kicker">BROS × ORIGEN</p>
          <h1 id="empower-title">EMPODÉRATE</h1>
          <p className="empower-intro">
            Tres días entre hombres para salir del ruido, conocerte mejor y
            volver con más claridad sobre cómo quieres vivir.
          </p>
          <div className="empower-hero-meta">
            <span>Liencres · Cantabria</span>
            <span>Finales de noviembre · 7 plazas</span>
          </div>
          <a className="empower-button empower-button--light" href="#solicitud">
            Solicitar plaza
            <i className="external-link-dot" aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="empower-moment empower-shell" aria-labelledby="moment-title">
        <Reveal className="empower-moment-lead">
          <p className="empower-eyebrow">El momento</p>
          <h2 id="moment-title">
            Puede que tu vida esté bien.
            <span>Pero sabes que puede haber algo más.</span>
          </h2>
        </Reveal>
        <div className="empower-moment-grid">
          <Reveal className="empower-everyday">
            <p>Tienes trabajo. Amigos. Proyectos.</p>
            <p>Entrenas. Viajas. Quizá tienes pareja.</p>
          </Reveal>
          <div className="empower-questions">
            {QUESTIONS.map((question, index) => (
              <motion.p
                key={question}
                initial={reducedMotion ? false : { opacity: 0, x: 30 }}
                whileInView={reducedMotion ? undefined : { opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8, delay: index * 0.08, ease: CINEMATIC_ENTRY_EASE }}
              >
                {question}
              </motion.p>
            ))}
          </div>
        </div>
        <Reveal className="empower-moment-close">
          EMPODÉRATE es un espacio para parar y explorar esas preguntas junto a otros hombres.
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
                initial={reducedMotion ? false : { opacity: 0, y: 44 }}
                whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
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
        <div className="empower-image-break empower-image-break--forest" role="img" aria-label="Bosque costero de Liencres" />
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
        <div className="empower-bros-media" aria-hidden="true" />
        <div className="empower-bros-overlay" aria-hidden="true" />
        <Reveal className="empower-bros-copy">
          <p className="empower-eyebrow">BROS</p>
          <h2 id="bros-philosophy-title">No venimos a enseñarte cómo ser un hombre.</h2>
          <p>Venimos a crear un espacio donde podamos explorarlo juntos.</p>
          <p className="empower-bros-plain">Sin personajes. Sin gurús. Sin postureo espiritual.</p>
          <p>
            Hombres hablando con hombres sobre cosas de las que normalmente no
            hablamos. Y también entrenando, comiendo, riéndonos, jugando y
            metiéndonos al mar.
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
          <h2 id="info-title">EMPODÉRATE</h2>
          <p>BROS × ORIGEN</p>
        </Reveal>
        <Reveal className="empower-info-list">
          <dl>
            <div><dt>Lugar</dt><dd>Origen Liencres · Cantabria</dd></div>
            <div><dt>Fechas</dt><dd>Finales de noviembre</dd></div>
            <div><dt>Duración</dt><dd>Viernes — Domingo</dd></div>
            <div><dt>Grupo</dt><dd>7 participantes</dd></div>
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
              <label>¿Por qué te interesa EMPODÉRATE?<textarea name="why" rows={3} required /></label>
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
          <p>Quizá solo necesitas crear el espacio para hacerte mejores preguntas.</p>
          <strong>EMPODÉRATE</strong>
          <span>BROS × ORIGEN · LIENCRES · CANTABRIA</span>
          <a className="empower-button empower-button--light" href="#solicitud">
            Solicitar plaza
            <i className="external-link-dot" aria-hidden="true" />
          </a>
        </Reveal>
      </section>

      <footer className="empower-footer">
        <span>EMPODÉRATE · BROS × ORIGEN</span>
        <InstagramLink />
        <span>Liencres · Cantabria</span>
      </footer>
    </main>
  );
}
