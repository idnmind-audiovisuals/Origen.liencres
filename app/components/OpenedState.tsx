"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  CINEMATIC_ENTRY_EASE,
  GATEWAY_MOTION,
} from "../lib/gateway-motion";

type OpenedStateProps = {
  development: boolean;
  onReset?: () => void;
};

export function OpenedState({ development, onReset }: OpenedStateProps) {
  const reducedMotion = useReducedMotion();
  const backgroundDuration = reducedMotion
    ? GATEWAY_MOTION.opened.reducedBackgroundDuration
    : GATEWAY_MOTION.opened.backgroundDuration;
  const textDelay = reducedMotion ? backgroundDuration : GATEWAY_MOTION.opened.textDelay;

  return (
    <motion.main
      className="opened-state"
      initial={{ backgroundColor: "#24231f" }}
      animate={{ backgroundColor: "#f2efe8" }}
      transition={{ duration: backgroundDuration, ease: CINEMATIC_ENTRY_EASE }}
    >
      <motion.p
        role="status"
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: textDelay,
          duration: reducedMotion ? 0.08 : GATEWAY_MOTION.opened.textDuration,
          ease: CINEMATIC_ENTRY_EASE,
        }}
      >
        opened
      </motion.p>
      {development && onReset ? (
        <motion.button
          className="session-reset"
          type="button"
          onClick={onReset}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: textDelay,
            duration: reducedMotion ? 0.08 : GATEWAY_MOTION.opened.textDuration,
            ease: CINEMATIC_ENTRY_EASE,
          }}
        >
          reset session
        </motion.button>
      ) : null}
    </motion.main>
  );
}
