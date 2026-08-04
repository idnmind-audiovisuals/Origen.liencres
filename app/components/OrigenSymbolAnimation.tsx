"use client";

import { motion, useAnimationControls } from "framer-motion";
import { ReactNode, useEffect } from "react";
import {
  CINEMATIC_ENTRY_EASE,
  GATEWAY_MOTION,
  LIGHT_EMERGENCE_EASE,
  ORGANIC_EASE,
} from "../lib/gateway-motion";

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
  const reactionProgress =
    GATEWAY_MOTION.success.reactionDuration /
    GATEWAY_MOTION.success.zoomDelay;

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
        initial={{ opacity: 0, scale: 0.0002 }}
        animate={{ opacity: 1, scale: GATEWAY_MOTION.firstLight.scale }}
        transition={{
          delay: GATEWAY_MOTION.firstLight.delay,
          duration: GATEWAY_MOTION.firstLight.duration,
          ease: LIGHT_EMERGENCE_EASE,
        }}
      />

      <div className="symbol-positioner">
        <motion.div
          className="symbol-stage"
          animate={feedbackControls}
          aria-hidden={false}
        >
          <motion.div
            className="unlock-response"
            animate={
              unlocked
                ? {
                    opacity: [1, 1, 0],
                    scale: [1, 1.018, GATEWAY_MOTION.success.handoffScale],
                  }
                : { opacity: 1, scale: 1 }
            }
            transition={
              unlocked
                ? {
                    duration: GATEWAY_MOTION.success.zoomDelay,
                    ease: CINEMATIC_ENTRY_EASE,
                    times: [0, reactionProgress, 1],
                  }
                : { duration: 0.2, ease: ORGANIC_EASE }
            }
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

          </motion.div>

          {children}
        </motion.div>
      </div>
    </>
  );
}
