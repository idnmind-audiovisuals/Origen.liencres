"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";
import { ORIGEN_HEADER_WORDMARK_BLACK_ASSET } from "../lib/brand";
import { CINEMATIC_ENTRY_EASE, GATEWAY_MOTION } from "../lib/gateway-motion";
import { HomeNavigation } from "./HomeNavigation";

export function OrigenHomeState() {
  const reducedMotion = useReducedMotion();
  const contentDelay = reducedMotion ? 0 : GATEWAY_MOTION.opened.textDelay;
  const videoDialog = useRef<HTMLDialogElement>(null);
  const [videoOpen, setVideoOpen] = useState(false);

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

        <section className="origen-home-hero" aria-labelledby="origen-home-title">
          <div className="origen-home-copy">
            <p>The space · Origen Liencres</p>
            <h1 id="origen-home-title">A space of possibilities.</h1>
            <div className="origen-home-intro">
              <p>
                A private home between sea and forest for retreats,
                residencies, circles and meaningful stays.
              </p>
              <small>9 guests · 3 bedrooms · 1 shala</small>
              <Link href="/organiza-tu-retiro-cantabria#host">
                Book the space
                <span aria-hidden="true" />
              </Link>
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/origen-home-video-poster.jpg"
              alt="A gathering in the shala at Origen Liencres"
              width={720}
              height={1280}
            />
            <button
              className="origen-home-video-trigger"
              type="button"
              aria-haspopup="dialog"
              onClick={() => {
                videoDialog.current?.showModal();
                setVideoOpen(true);
              }}
            >
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
                <path fill="currentColor" d="M4 2.75v10.5L13 8z" />
              </svg>
              Watch video
            </button>
            <figcaption>Liencres · Cantabria</figcaption>
          </motion.figure>
        </section>
      </motion.div>

      <dialog
        ref={videoDialog}
        className="origen-home-video-dialog"
        aria-label="A moment at Origen Liencres"
        onClose={() => setVideoOpen(false)}
      >
        <button type="button" onClick={() => videoDialog.current?.close()}>
          Close
        </button>
        {videoOpen && (
          <video
            aria-label="A moment at Origen Liencres"
            controls
            autoPlay
            playsInline
            poster="/origen-home-video-poster.jpg"
            width={720}
            height={1280}
          >
            <source src="/origen-home-video.mp4" type="video/mp4" />
            <p><a href="/origen-home-video.mp4">Open the Origen video</a></p>
          </video>
        )}
      </dialog>

      <HomeNavigation
        visible
        reducedMotion={Boolean(reducedMotion)}
        className="gateway-home-menu--main"
      />
    </main>
  );
}
