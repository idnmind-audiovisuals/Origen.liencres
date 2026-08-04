"use client";

import { motion } from "framer-motion";
import { GATEWAY_MOTION, ORGANIC_EASE } from "../lib/gateway-motion";

type SuccessTransitionProps = {
  active: boolean;
};

export function SuccessTransition({ active }: SuccessTransitionProps) {
  return (
    <motion.div
      className="success-wash"
      aria-hidden="true"
      initial={false}
      animate={{
        opacity: active ? 1 : 0,
        scale: active ? 150 : 0.12,
      }}
      transition={{
        opacity: {
          delay: active ? GATEWAY_MOTION.success.washDelay : 0,
          duration: active ? 0.08 : 0,
        },
        scale: {
          delay: active ? GATEWAY_MOTION.success.washDelay : 0,
          duration: active ? GATEWAY_MOTION.success.washDuration : 0,
          ease: ORGANIC_EASE,
        },
      }}
    />
  );
}
