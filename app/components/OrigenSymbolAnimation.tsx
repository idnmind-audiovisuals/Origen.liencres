"use client";

import { motion, useAnimationControls } from "framer-motion";
import { ReactNode, useEffect } from "react";
import { ORIGEN_SYMBOL_ASSET } from "../lib/brand";
import { GATEWAY_MOTION, ORGANIC_EASE } from "../lib/gateway-motion";

type OrigenSymbolAnimationProps = {
  children?: ReactNode;
  errorPulse: number;
  unlocked: boolean;
};

export function OrigenSymbolAnimation({
  children,
  errorPulse,
  unlocked,
}: OrigenSymbolAnimationProps) {
  const feedbackControls = useAnimationControls();

  useEffect(() => {
    if (errorPulse === 0) return;

    void feedbackControls.start({
      opacity: [1, 0.8, 1],
      transition: {
        duration: GATEWAY_MOTION.incorrect.duration,
        ease: ORGANIC_EASE,
      },
    });
  }, [errorPulse, feedbackControls]);

  return (
    <>
      <motion.div
        className="first-light"
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.001 }}
        animate={{ opacity: [0, 0.18, 1], scale: GATEWAY_MOTION.firstLight.scale }}
        transition={{
          delay: GATEWAY_MOTION.firstLight.delay,
          duration: GATEWAY_MOTION.firstLight.duration,
          ease: ORGANIC_EASE,
          opacity: { times: [0, 0.08, 1] },
        }}
      />

      <motion.div
        className="symbol-stage"
        animate={feedbackControls}
        aria-hidden={false}
      >
        <motion.div
          className="unlock-response"
          animate={
            unlocked
              ? { scale: [1, 1.018, 0.994, 1] }
              : { scale: 1 }
          }
          transition={{
            duration: GATEWAY_MOTION.success.symbolResponse,
            ease: ORGANIC_EASE,
          }}
        >
          <div className="forming-disc-shell" aria-hidden="true">
            <motion.div
              className="forming-disc"
              initial={{ opacity: 0, scale: 0.02 }}
              animate={{
                opacity: [0, 1, 1, 1],
                scale: [0.02, 1, 0.985, 1],
              }}
              transition={{
                delay: GATEWAY_MOTION.darkCircle.delay,
                duration: GATEWAY_MOTION.darkCircle.duration,
                times: [0, 0.72, 0.9, 1],
                ease: ORGANIC_EASE,
              }}
            />
          </div>

          <div className="forming-inner-shell" aria-hidden="true">
            <motion.div
              className="forming-inner"
              initial={{ opacity: 0, scale: 0.02 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: GATEWAY_MOTION.innerLight.delay,
                duration: GATEWAY_MOTION.innerLight.duration,
                ease: ORGANIC_EASE,
              }}
            />
          </div>

          <motion.div
            className="forming-dot"
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.15 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: GATEWAY_MOTION.centreDot.delay,
              duration: GATEWAY_MOTION.centreDot.duration,
              ease: ORGANIC_EASE,
            }}
          />

          <motion.div
            className="official-symbol"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: GATEWAY_MOTION.exactMark.delay,
              duration: GATEWAY_MOTION.exactMark.duration,
              ease: ORGANIC_EASE,
            }}
          >
            {/* The official raster is intentionally rendered without recomposition. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ORIGEN_SYMBOL_ASSET}
              width="283"
              height="244"
              alt=""
              draggable="false"
              fetchPriority="high"
            />
          </motion.div>
        </motion.div>

        {children}
      </motion.div>
    </>
  );
}
