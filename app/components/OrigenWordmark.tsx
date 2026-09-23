"use client";

import { motion } from "framer-motion";
import { ORIGEN_WORDMARK_ASSET } from "../lib/brand";
import { GATEWAY_MOTION, ORGANIC_EASE } from "../lib/gateway-motion";

type OrigenWordmarkProps = {
  visible: boolean;
  reducedMotion?: boolean;
};

export function OrigenWordmark({
  visible,
  reducedMotion = false,
}: OrigenWordmarkProps) {
  return (
    <div
      className="origen-wordmark"
      role="img"
      aria-label="Origen"
    >
      <motion.div
        className="origen-wordmark-motion"
        initial={false}
        animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 6 }}
        transition={{
          duration: reducedMotion
            ? 0.16
            : GATEWAY_MOTION.success.interfaceFade,
          ease: ORGANIC_EASE,
        }}
      >
        {/* The supplied wordmark is used as a mask so its brand color is exact. */}
        <span
          className="origen-wordmark-image"
          aria-hidden="true"
          style={{
            WebkitMaskImage: `url("${ORIGEN_WORDMARK_ASSET}")`,
            maskImage: `url("${ORIGEN_WORDMARK_ASSET}")`,
          }}
        />
      </motion.div>
    </div>
  );
}
