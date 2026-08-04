"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useSyncExternalStore } from "react";
import { AccessKeyForm } from "./AccessKeyForm";
import { OpenedState } from "./OpenedState";
import { OrigenSymbolAnimation } from "./OrigenSymbolAnimation";
import { ReducedMotionGateway } from "./ReducedMotionGateway";
import { SuccessTransition } from "./SuccessTransition";
import { GATEWAY_MOTION, ORGANIC_EASE } from "../lib/gateway-motion";

type AccessGatewayProps = {
  development: boolean;
  initiallyAuthenticated: boolean;
  onOpened?: () => void;
};

type GatewayState = "forming" | "ready" | "opening" | "opened";

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
  initiallyAuthenticated,
  onOpened,
}: AccessGatewayProps) {
  const reduced = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionPreference,
    () => false,
  );
  const [state, setState] = useState<GatewayState>(
    initiallyAuthenticated ? "opened" : "forming",
  );
  const [errorPulse, setErrorPulse] = useState(0);
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    if (initiallyAuthenticated || reduced) return;

    const reveal = window.setTimeout(
      () => setState("ready"),
      GATEWAY_MOTION.formRevealMs,
    );

    return () => window.clearTimeout(reveal);
  }, [initiallyAuthenticated, reduced]);

  useEffect(() => {
    if (state !== "opening") return;

    const opened = window.setTimeout(() => {
      setState("opened");
      onOpened?.();
      window.dispatchEvent(new CustomEvent("origen:opened"));
    }, GATEWAY_MOTION.success.openedDelayMs);

    return () => window.clearTimeout(opened);
  }, [onOpened, state]);

  async function resetSession() {
    await fetch("/api/access", { method: "DELETE" });
    window.location.reload();
  }

  if (reduced) {
    return (
      <ReducedMotionGateway
        development={development}
        initiallyAuthenticated={initiallyAuthenticated}
        onOpened={onOpened}
      />
    );
  }

  if (state === "opened") {
    return <OpenedState development={development} onReset={resetSession} />;
  }

  const formVisible = state === "ready";
  const opening = state === "opening";

  return (
    <main
      className={`gateway${keyboardOpen ? " keyboard-open" : ""}`}
      data-state={state}
    >
      <h1 className="sr-only">Origen access gateway</h1>

      <OrigenSymbolAnimation errorPulse={errorPulse} unlocked={opening}>
        <AccessKeyForm
          visible={formVisible}
          disabled={opening}
          onIncorrect={() => setErrorPulse((current) => current + 1)}
          onSuccess={() => {
            setKeyboardOpen(false);
            setState("opening");
          }}
          onFocusChange={setKeyboardOpen}
        />
      </OrigenSymbolAnimation>

      <SuccessTransition active={opening} />

      <motion.p
        className="opening-status sr-only"
        role="status"
        aria-live="polite"
        initial={false}
        animate={{ opacity: opening ? 1 : 0 }}
        transition={{ duration: 0.2, ease: ORGANIC_EASE }}
      >
        {opening ? "Access accepted. Origen is opening." : ""}
      </motion.p>
    </main>
  );
}
