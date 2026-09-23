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
        {/* Preserve the supplied crescent while mapping its two brand tones. */}
        <svg
          className="origen-wordmark-image"
          viewBox="0 0 1090 296"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <filter
              id="origen-wordmark-gateway-colors"
              colorInterpolationFilters="sRGB"
            >
              <feColorMatrix
                type="matrix"
                values="
                  -0.145631 0 0 0 0.969579
                  0 -0.357843 0 0 0.986371
                  0 0 -0.761194 0 1.002338
                  0 0 0 1 0
                "
              />
            </filter>
          </defs>
          <image
            href={ORIGEN_WORDMARK_ASSET}
            width="1090"
            height="296"
            filter="url(#origen-wordmark-gateway-colors)"
          />
        </svg>
      </motion.div>
    </div>
  );
}
