"use client";

import { motion } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";
import {
  CINEMATIC_ENTRY_EASE,
  CONCENTRIC_ZOOM_EASE,
  GATEWAY_MOTION,
} from "../lib/gateway-motion";

type SuccessTransitionProps = {
  active: boolean;
};

type CircleMetrics = {
  outerScale: number;
  innerScale: number;
  dotScale: number;
  outerY: number;
  innerY: number;
  dotY: number;
};

export function SuccessTransition({ active }: SuccessTransitionProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const blackCircleRef = useRef<HTMLDivElement>(null);
  const whiteCircleRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState<CircleMetrics>({
    outerScale: 12,
    innerScale: 12,
    dotScale: 36,
    outerY: 0,
    innerY: 0,
    dotY: 0,
  });

  useLayoutEffect(() => {
    const measureViewport = () => {
      const stage = stageRef.current;
      const outer = blackCircleRef.current;
      const inner = whiteCircleRef.current;
      const dot = dotRef.current;
      if (!stage || !outer || !inner || !dot) return;

      const requiredDiameter = Math.sqrt(
        window.innerWidth ** 2 + window.innerHeight ** 2,
      );
      const stageScale = GATEWAY_MOTION.success.handoffScale;
      const stageHeight = stage.offsetHeight;
      const zoomOriginY = stageHeight * 0.610656 + dot.offsetWidth / 2;

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
        innerScale: scaledCover(
          inner.offsetWidth,
          GATEWAY_MOTION.success.innerCoverageOverscan,
        ),
        dotScale: scaledCover(
          dot.offsetWidth,
          GATEWAY_MOTION.success.coverageOverscan,
        ),
        outerY: centredY(0.032787, outer.offsetWidth),
        innerY: centredY(0.217213, inner.offsetWidth),
        dotY: centredY(0.610656, dot.offsetWidth),
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
              ref={whiteCircleRef}
              className="transition-white-circle"
              initial={false}
              animate={
                active
                  ? {
                      scale: [1, 1.055, metrics.innerScale],
                      y: [0, 0, metrics.innerY],
                    }
                  : { scale: 1, y: 0 }
              }
              transition={
                active
                  ? { ...zoomTransition, times: [0, 0.16, 1] }
                  : zoomTransition
              }
            />
          </div>

          <motion.div
            ref={dotRef}
            className="transition-black-dot"
            initial={false}
            animate={
              active
                ? {
                    scale: [1, 1.08, metrics.dotScale],
                    y: [0, 0, metrics.dotY],
                  }
                : { scale: 1, y: 0 }
            }
            transition={
              active
                ? { ...zoomTransition, times: [0, 0.16, 1] }
                : zoomTransition
            }
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
