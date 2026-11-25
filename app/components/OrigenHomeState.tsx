"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";
import { ORIGEN_HEADER_WORDMARK_BLACK_ASSET } from "../lib/brand";
import { CINEMATIC_ENTRY_EASE, GATEWAY_MOTION } from "../lib/gateway-motion";
import { HomeNavigation } from "./HomeNavigation";
import { LoopingVideo } from "./LoopingVideo";
import { BookingCalendar } from "./BookingCalendar";

const SPACE_PHOTOS = [
  {
    src: "/origen-rebros-house-exterior.avif",
    alt: "Casa Origen Liencres con su jardín al atardecer",
    caption: "La casa y el jardín",
    width: 1440,
    height: 1080,
  },
  {
    src: "/origen-casa-shala.webp",
    alt: "Shala cubierta de madera con vistas al paisaje costero de Liencres",
    caption: "La shala",
    width: 720,
    height: 540,
  },
  {
    src: "/origen-casa-salon.webp",
    alt: "Salón común y cocina abierta bajo vigas de madera",
    caption: "El salón y la cocina",
    width: 720,
    height: 540,
  },
  {
    src: "/origen-casa-dormitorio.webp",
    alt: "Dormitorio de Origen con cama doble y techo de madera",
    caption: "Un dormitorio",
    width: 960,
    height: 1280,
  },
] as const;

export function OrigenHomeState() {
  const reducedMotion = useReducedMotion();
  const contentDelay = reducedMotion ? 0 : GATEWAY_MOTION.opened.textDelay;

  useEffect(() => {
    // These sections mount after the logo animation, including on direct links.
    const hash = window.location.hash;
    if (hash === "#fotos" || hash === "#reservar") {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    }
  }, []);

  return (
    <main id="origen-home" className="origen-home-page">
      <motion.div
        className="origen-home-texture"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: reducedMotion ? 0.12 : GATEWAY_MOTION.opened.backgroundDuration,
          ease: CINEMATIC_ENTRY_EASE,
        }}
      />

      <motion.div
        className="origen-home-content"
        initial={{ opacity: 0, y: reducedMotion ? 0 : 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: contentDelay,
          duration: reducedMotion ? 0.12 : GATEWAY_MOTION.opened.textDuration,
          ease: CINEMATIC_ENTRY_EASE,
        }}
      >
        <header className="origen-home-header">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ORIGEN_HEADER_WORDMARK_BLACK_ASSET}
            width="2098"
            height="750"
            alt="Origen"
          />
          <p>Liencres · Costa Quebrada</p>
        </header>

        <section className="origen-home-hero" aria-labelledby="origen-home-title" lang="en">
          <div className="origen-home-copy">
            <p>The space · Origen Liencres</p>
            <h1 id="origen-home-title">A space of possibilities.</h1>
            <div className="origen-home-intro">
              <p>
                A private home between sea and forest for retreats,
                residencies, circles and meaningful stays.
              </p>
              <small>9 guests · 3 bedrooms · 1 shala</small>
              <a href="#reservar" lang="es">
                Ver disponibilidad
                <span aria-hidden="true" />
              </a>
              <div className="origen-home-detail-links" lang="es">
                <a className="origen-home-detail-link" href="#fotos">Ver fotos</a>
                <Link className="origen-home-detail-link" href="/retiros">Conoce el espacio</Link>
              </div>
            </div>
          </div>
          <motion.figure
            className="origen-home-space-image"
            initial={{ opacity: 0, scale: reducedMotion ? 1 : 1.035 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: reducedMotion ? 0 : 0.12,
              duration: reducedMotion ? 0.12 : 1.15,
              ease: CINEMATIC_ENTRY_EASE,
            }}
          >
            <LoopingVideo
              aria-label="A gathering at Origen Liencres"
              src="/origen-home-video.mp4"
              poster="/origen-home-video-poster.jpg"
              width={720}
              height={1280}
            >
              <p><a href="/origen-home-video.mp4">Open the Origen video</a></p>
            </LoopingVideo>
            <figcaption>Liencres · Cantabria</figcaption>
          </motion.figure>
        </section>
      </motion.div>

      <section id="fotos" className="origen-home-gallery" aria-labelledby="origen-home-gallery-title" lang="es">
        <header>
          <p className="retreat-public-eyebrow">El espacio · Liencres</p>
          <h2 id="origen-home-gallery-title">La casa en imágenes.</h2>
        </header>
        <div className="origen-home-photo-grid">
          {SPACE_PHOTOS.map(({ src, alt, caption, width, height }) => (
            <figure key={src}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
              <figcaption>{caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <BookingCalendar />

      <HomeNavigation
        visible
        reducedMotion={Boolean(reducedMotion)}
        className="gateway-home-menu--main"
      />
    </main>
  );
}
