"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { GATEWAY_MOTION } from "../lib/gateway-motion";
import { OrigenHomeState } from "./OrigenHomeState";
import { OrigenSymbolAnimation } from "./OrigenSymbolAnimation";
import { OrigenWordmark } from "./OrigenWordmark";
import { ReducedMotionGateway } from "./ReducedMotionGateway";

type GatewayState = "forming" | "resting" | "opening" | "opened";

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
    if (reduced || (state !== "forming" && state !== "resting")) return;
    const forming = state === "forming";
    const reveal = window.setTimeout(
      () => setState(forming ? "resting" : "opening"),
      forming ? GATEWAY_MOTION.formationDurationMs : GATEWAY_MOTION.wordmarkHoldMs,
    );
    return () => window.clearTimeout(reveal);
  }, [reduced, state]);

  if (reduced) return <ReducedMotionGateway />;
  if (state === "opened") return <OrigenHomeState />;

  return (
    <main className="gateway" data-state={state}>
      <OrigenSymbolAnimation
        opening={state === "opening"}
        onOpened={() => setState("opened")}
      />
      <OrigenWordmark visible={state === "resting"} />

      <p className="sr-only" role="status" aria-live="polite">
        {state === "opening" ? "Entrando en Origen." : "Origen Liencres."}
      </p>
    </main>
  );
}
