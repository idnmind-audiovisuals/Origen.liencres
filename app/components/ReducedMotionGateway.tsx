"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CINEMATIC_ENTRY_EASE, GATEWAY_MOTION } from "../lib/gateway-motion";
import { GatewayCrescentArtwork } from "./GatewayCrescentArtwork";
import { OrigenHomeState } from "./OrigenHomeState";
import { OrigenWordmark } from "./OrigenWordmark";

export function ReducedMotionGateway() {
  const [phase, setPhase] = useState<"ready" | "unlocking" | "opened">(
    "ready",
  );

  useEffect(() => {
    if (phase !== "ready") return;
    const open = window.setTimeout(
      () => setPhase("unlocking"),
      180,
    );
    return () => window.clearTimeout(open);
  }, [phase]);

  useEffect(() => {
    if (phase !== "unlocking") return;
    const opened = window.setTimeout(
      () => setPhase("opened"),
      GATEWAY_MOTION.reduced.openedDelayMs,
    );
    return () => window.clearTimeout(opened);
  }, [phase]);

  if (phase === "opened") return <OrigenHomeState />;

  const unlocking = phase === "unlocking";

  return (
    <motion.main
      className="gateway gateway-reduced"
      data-state={phase}
      initial={false}
      animate={{ backgroundColor: unlocking ? "#d4a64f" : "#f2efe8" }}
      transition={{
        delay: unlocking ? GATEWAY_MOTION.reduced.blackDelay : 0,
        duration: unlocking ? GATEWAY_MOTION.reduced.blackDuration : 0,
        ease: CINEMATIC_ENTRY_EASE,
      }}
    >
      <h1 className="sr-only">Origen Liencres</h1>
      <motion.div
        className="gateway-portal-static"
        aria-hidden="true"
        initial={false}
        animate={{ opacity: unlocking ? 0 : 1 }}
        transition={{
          duration: unlocking ? GATEWAY_MOTION.reduced.symbolFade : 0,
          ease: CINEMATIC_ENTRY_EASE,
        }}
      />
      <div className="symbol-positioner">
        <motion.section
          className="symbol-stage reduced-symbol"
          aria-label="Símbolo de Origen"
          initial={false}
          animate={{ opacity: unlocking ? 0 : 1 }}
          transition={{
            duration: unlocking ? GATEWAY_MOTION.reduced.symbolFade : 0,
            ease: CINEMATIC_ENTRY_EASE,
          }}
        >
          <div className="reduced-circle-geometry" aria-hidden="true">
            <div className="forming-disc-shell">
              <div className="forming-disc" />
            </div>
            <div className="forming-inner-shell">
              <div className="forming-inner" />
            </div>
            <GatewayCrescentArtwork className="forming-crescent-art" />
            <div className="forming-dot" />
          </div>
        </motion.section>
      </div>
      <OrigenWordmark visible={!unlocking} reducedMotion />
    </motion.main>
  );
}
