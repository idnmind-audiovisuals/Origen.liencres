"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useSyncExternalStore } from "react";
import { AccessKeyForm } from "./AccessKeyForm";
import { BrosState } from "./BrosState";
import { ExperienceState } from "./ExperienceState";
import { OpenedState } from "./OpenedState";
import { OrigenSymbolAnimation } from "./OrigenSymbolAnimation";
import { OrigenWordmark } from "./OrigenWordmark";
import { ReducedMotionGateway } from "./ReducedMotionGateway";
import { SuccessTransition } from "./SuccessTransition";
import { GATEWAY_MOTION, ORGANIC_EASE } from "../lib/gateway-motion";
import type { AccessDestination } from "../lib/access-types";
import type { Language } from "../lib/language";

type AccessGatewayProps = {
  development: boolean;
  initialLanguage: Language;
  onOpened?: () => void;
};

type GatewayState = "forming" | "ready" | "unlocking" | "opened";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(callback: () => void) {
  const mediaQuery = window.matchMedia(reducedMotionQuery);
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getReducedMotionPreference() {
  return window.matchMedia(reducedMotionQuery).matches;
}

export function AccessGateway({
  development,
  initialLanguage,
  onOpened,
}: AccessGatewayProps) {
  const reduced = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionPreference,
    () => false,
  );
  const [state, setState] = useState<GatewayState>("forming");
  const [destination, setDestination] =
    useState<AccessDestination | null>(null);
  const [errorPulse, setErrorPulse] = useState(0);
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    if (reduced) return;

    const reveal = window.setTimeout(
      () => setState("ready"),
      GATEWAY_MOTION.formRevealMs,
    );

    return () => window.clearTimeout(reveal);
  }, [reduced]);

  useEffect(() => {
    if (state !== "unlocking") return;

    const opened = window.setTimeout(
      () => {
        setState("opened");
        onOpened?.();
        window.dispatchEvent(new CustomEvent("origen:opened"));
      },
      (GATEWAY_MOTION.success.zoomDelay +
        GATEWAY_MOTION.success.zoomDuration +
        GATEWAY_MOTION.success.blackHold) *
        1000,
    );

    return () => window.clearTimeout(opened);
  }, [onOpened, state]);

  useEffect(() => {
    if (state !== "opened" || !destination) return;
    window.history.replaceState(window.history.state, "", destination);
  }, [destination, state]);

  async function resetSession() {
    await fetch("/api/access", { method: "DELETE" });
    window.location.replace("/");
  }

  if (reduced) {
    return (
      <ReducedMotionGateway
        development={development}
        initialLanguage={initialLanguage}
        onOpened={onOpened}
      />
    );
  }

  if (state === "opened" && destination === "/circulo-de-hombres") {
    return <BrosState development={development} onReset={resetSession} />;
  }

  if (state === "opened" && destination === "/residency") {
    return (
      <OpenedState
        development={development}
        initialLanguage={initialLanguage}
        onReset={resetSession}
        variant="residency"
      />
    );
  }

  if (state === "opened" && destination === "/space") {
    return (
      <OpenedState
        development={development}
        initialLanguage={initialLanguage}
        onReset={resetSession}
        variant="space"
      />
    );
  }

  if (state === "opened" && destination === "/experience") {
    return <ExperienceState development={development} onReset={resetSession} />;
  }

  const formVisible = state === "ready";
  const unlocking = state === "unlocking";

  return (
    <main
      className={`gateway${keyboardOpen ? " keyboard-open" : ""}`}
      data-state={state}
    >
      <h1 className="sr-only">Origen access gateway</h1>

      <OrigenSymbolAnimation errorPulse={errorPulse} unlocked={unlocking}>
        <AccessKeyForm
          visible={formVisible}
          disabled={unlocking}
          onIncorrect={() => setErrorPulse((current) => current + 1)}
          onSuccess={(nextDestination) => {
            setKeyboardOpen(false);
            setDestination(nextDestination);
            setState("unlocking");
          }}
          onFocusChange={setKeyboardOpen}
        />
      </OrigenSymbolAnimation>

      <OrigenWordmark visible={formVisible} />

      <SuccessTransition active={unlocking} />

      <motion.p
        className="opening-status sr-only"
        role="status"
        aria-live="polite"
        initial={false}
        animate={{ opacity: unlocking ? 1 : 0 }}
        transition={{ duration: 0.2, ease: ORGANIC_EASE }}
      >
        {unlocking ? "Access accepted. Entering Origen." : ""}
      </motion.p>
    </main>
  );
}
