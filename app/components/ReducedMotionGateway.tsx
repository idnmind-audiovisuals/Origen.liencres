"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AccessKeyForm } from "./AccessKeyForm";
import { BrosState } from "./BrosState";
import { HostsCircleState } from "./HostsCircleState";
import { ExperienceState } from "./ExperienceState";
import { OpenedState } from "./OpenedState";
import { OrigenWordmark } from "./OrigenWordmark";
import {
  CINEMATIC_ENTRY_EASE,
  GATEWAY_MOTION,
} from "../lib/gateway-motion";
import { getHostsCircleLanguage, type AccessDestination } from "../lib/access-types";
import type { Language } from "../lib/language";

type ReducedMotionGatewayProps = {
  development: boolean;
  initialLanguage: Language;
  onOpened?: () => void;
};

export function ReducedMotionGateway({
  development,
  initialLanguage,
  onOpened,
}: ReducedMotionGatewayProps) {
  const [phase, setPhase] = useState<"ready" | "unlocking" | "opened">(
    "ready",
  );
  const [destination, setDestination] =
    useState<AccessDestination | null>(null);
  const [errorPulse, setErrorPulse] = useState(0);

  useEffect(() => {
    if (phase !== "unlocking") return;

    const opened = window.setTimeout(() => {
      setPhase("opened");
      onOpened?.();
      window.dispatchEvent(new CustomEvent("origen:opened"));
    }, GATEWAY_MOTION.reduced.openedDelayMs);

    return () => window.clearTimeout(opened);
  }, [onOpened, phase]);

  useEffect(() => {
    if (phase !== "opened" || !destination) return;
    window.history.replaceState(window.history.state, "", destination);
  }, [destination, phase]);

  async function resetSession() {
    await fetch("/api/access", { method: "DELETE" });
    window.location.replace("/");
  }

  if (phase === "opened" && destination === "/circulo-de-hombres") {
    return <BrosState development={development} onReset={resetSession} />;
  }

  if (phase === "opened" && destination === "/residency") {
    return (
      <OpenedState
        development={development}
        initialLanguage={initialLanguage}
        onReset={resetSession}
        variant="residency"
      />
    );
  }

  if (phase === "opened" && destination === "/space") {
    return (
      <OpenedState
        development={development}
        initialLanguage={initialLanguage}
        onReset={resetSession}
        variant="space"
      />
    );
  }

  if (phase === "opened" && destination === "/experience") {
    return <ExperienceState development={development} onReset={resetSession} />;
  }

  const hostsLanguage = getHostsCircleLanguage(destination);
  if (phase === "opened" && hostsLanguage) {
    return <HostsCircleState initialLanguage={hostsLanguage} />;
  }

  const unlocking = phase === "unlocking";

  return (
    <motion.main
      className="gateway gateway-reduced"
      data-error={errorPulse || undefined}
      data-state={phase}
      initial={false}
      animate={{ backgroundColor: "#24231f" }}
      transition={{
        delay: unlocking ? GATEWAY_MOTION.reduced.blackDelay : 0,
        duration: unlocking ? GATEWAY_MOTION.reduced.blackDuration : 0,
        ease: CINEMATIC_ENTRY_EASE,
      }}
    >
      <h1 className="sr-only">Origen access gateway</h1>
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
          aria-label="Origen access"
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
            <div className="forming-dot" />
          </div>
          <AccessKeyForm
            visible={!unlocking}
            disabled={unlocking}
            reducedMotion
            onIncorrect={() => setErrorPulse((current) => current + 1)}
            onSuccess={(nextDestination) => {
              setDestination(nextDestination);
              setPhase("unlocking");
            }}
          />
        </motion.section>
      </div>
      <OrigenWordmark visible={!unlocking} reducedMotion />
      <motion.section
        className="gateway-public-entry"
        initial={false}
        animate={{ opacity: unlocking ? 0 : 1 }}
        transition={{ duration: 0.2, ease: CINEMATIC_ENTRY_EASE }}
      >
        <span>Origen Liencres · Costa Quebrada</span>
        <h1>Espacio para residencias y retiros en Cantabria</h1>
        <p>
          La casa reúne naturaleza, playa y bosque para retiros íntimos y
          residencias creativas.
        </p>
        <a href="/espacio-retiros-cantabria">
          Organiza tu retiro
          <i className="external-link-dot" aria-hidden="true" />
        </a>
      </motion.section>
      <p className="sr-only" role="status" aria-live="polite">
        {unlocking ? "Access accepted. Entering Origen." : ""}
      </p>
    </motion.main>
  );
}
