"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { GATEWAY_MOTION } from "../lib/gateway-motion";
import { OrigenHomeState } from "./OrigenHomeState";
import { OrigenSymbolAnimation } from "./OrigenSymbolAnimation";
import { ReducedMotionGateway } from "./ReducedMotionGateway";
import { SuccessTransition } from "./SuccessTransition";

type GatewayState = "forming" | "unlocking" | "opened";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(callback: () => void) {
  const mediaQuery = window.matchMedia(reducedMotionQuery);
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getReducedMotionPreference() {
  return window.matchMedia(reducedMotionQuery).matches;
}

export function AccessGateway() {
  const reduced = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionPreference,
    () => false,
  );
  const [state, setState] = useState<GatewayState>("forming");

  useEffect(() => {
    if (reduced || state !== "forming") return;
    const reveal = window.setTimeout(
      () => setState("unlocking"),
      GATEWAY_MOTION.formRevealMs,
    );
    return () => window.clearTimeout(reveal);
  }, [reduced, state]);

  useEffect(() => {
    if (state !== "unlocking") return;
    const opened = window.setTimeout(
      () => setState("opened"),
      (GATEWAY_MOTION.success.zoomDelay +
        GATEWAY_MOTION.success.zoomDuration +
        GATEWAY_MOTION.success.blackHold) *
        1000,
    );
    return () => window.clearTimeout(opened);
  }, [state]);

  if (reduced) return <ReducedMotionGateway />;
  if (state === "opened") return <OrigenHomeState />;

  const unlocking = state === "unlocking";

  return (
    <main className="gateway" data-state={state}>
      <OrigenSymbolAnimation errorPulse={0} unlocked={unlocking} />

      <SuccessTransition active={unlocking} />

      <p className="sr-only" role="status" aria-live="polite">
        {state === "forming" ? "Formando Origen." : null}
        {state === "unlocking" ? "Entrando en Origen." : null}
      </p>
    </main>
  );
}
