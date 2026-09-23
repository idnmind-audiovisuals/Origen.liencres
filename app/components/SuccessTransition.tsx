"use client";

import { motion } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";
import {
  CINEMATIC_ENTRY_EASE,
  CONCENTRIC_ZOOM_EASE,
  GATEWAY_MOTION,
} from "../lib/gateway-motion";
import { GatewayCrescentArtwork } from "./GatewayCrescentArtwork";

type SuccessTransitionProps = {
  active: boolean;
};

type CircleMetrics = {
  outerScale: number;
  outerY: number;
};

export function SuccessTransition({ active }: SuccessTransitionProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const blackCircleRef = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState<CircleMetrics>({
    outerScale: 12,
    outerY: 0,
  });

  useLayoutEffect(() => {
    const measureViewport = () => {
      const stage = stageRef.current;
      const outer = blackCircleRef.current;
      if (!stage || !outer) return;

      const requiredDiameter = Math.sqrt(
        window.innerWidth ** 2 + window.innerHeight ** 2,
      );
      const stageScale = GATEWAY_MOTION.success.handoffScale;
      const stageHeight = stage.offsetHeight;
      const dotDiameter = stage.offsetWidth * 0.14841;
      const zoomOriginY = stageHeight * 0.610656 + dotDiameter / 2;

      const scaledCover = (diameter: number, overscan: number) =>
        (requiredDiameter * overscan) / (diameter * stageScale);
      const centredY = (topRatio: number, diameter: number) =>
        (zoomOriginY - (stageHeight * topRatio + diameter / 2)) *
        stageScale;

      setMetrics({
        outerScale: scaledCover(
          outer.offsetWidth,
          GATEWAY_MOTION.success.coverageOverscan,
        ),
        outerY: centredY(0.032787, outer.offsetWidth),
      });
    };

    measureViewport();
    window.addEventListener("resize", measureViewport);
    window.visualViewport?.addEventListener("resize", measureViewport);

    return () => {
      window.removeEventListener("resize", measureViewport);
      window.visualViewport?.removeEventListener("resize", measureViewport);
    };
  }, []);

  const zoomTransition = active
    ? {
        delay: GATEWAY_MOTION.success.zoomDelay,
        duration: GATEWAY_MOTION.success.zoomDuration,
        ease: CONCENTRIC_ZOOM_EASE,
      }
    : { duration: 0 };

  return (
    <motion.div
      className="success-transition"
      aria-hidden="true"
      initial={false}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{
        delay: active ? GATEWAY_MOTION.success.symbolCloneDelay : 0,
        duration: active ? GATEWAY_MOTION.success.symbolCloneFade : 0,
        ease: CINEMATIC_ENTRY_EASE,
      }}
    >
      <div className="success-stage-positioner">
        <motion.div
          ref={stageRef}
          className="success-symbol-stage"
          initial={false}
          animate={
            active
              ? { scale: [1, 1.018, GATEWAY_MOTION.success.handoffScale] }
              : { scale: 1 }
          }
          transition={
            active
              ? {
                  duration: GATEWAY_MOTION.success.zoomDelay,
                  ease: CINEMATIC_ENTRY_EASE,
                  times: [
                    0,
                    GATEWAY_MOTION.success.reactionDuration /
                      GATEWAY_MOTION.success.zoomDelay,
                    1,
                  ],
                }
              : { duration: 0 }
          }
        >
          <div className="transition-disc-shell">
            <motion.div
              ref={blackCircleRef}
              className="transition-black-circle"
              initial={false}
              animate={
                active
                  ? { scale: metrics.outerScale, y: metrics.outerY }
                  : { scale: 1, y: 0 }
              }
              transition={zoomTransition}
            />
          </div>

          <div className="transition-inner-shell">
            <motion.div
              className="transition-white-circle"
              initial={false}
              animate={
                active
                  ? {
                      opacity: [1, 1, 0],
                      scale: [1, 1.02, 0.98],
                    }
                  : { opacity: 1, scale: 1 }
              }
              transition={
                active
                  ? {
                      duration: GATEWAY_MOTION.success.zoomDelay + 0.24,
                      ease: CINEMATIC_ENTRY_EASE,
                      times: [0, 0.68, 1],
                    }
                  : { duration: 0 }
              }
            />
          </div>

          <motion.div
            className="transition-crescent-shell"
            initial={false}
            animate={active ? { opacity: [1, 1, 0] } : { opacity: 1 }}
            transition={
              active
                ? {
                    duration: GATEWAY_MOTION.success.zoomDelay + 0.24,
                    ease: CINEMATIC_ENTRY_EASE,
                    times: [0, 0.68, 1],
                  }
                : { duration: 0 }
            }
          >
            <GatewayCrescentArtwork className="forming-crescent-art" />
          </motion.div>

          <motion.div
            className="transition-black-dot"
            initial={false}
            animate={
              active
                ? {
                    opacity: [1, 1, 0],
                    scale: [1, 1.08, 1.16],
                  }
                : { opacity: 1, scale: 1 }
            }
            transition={
              active
                ? {
                    duration: GATEWAY_MOTION.success.zoomDelay + 0.24,
                    ease: CINEMATIC_ENTRY_EASE,
                    times: [0, 0.68, 1],
                  }
                : { duration: 0 }
            }
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
