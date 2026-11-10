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
  innerScale: number;
  innerY: number;
  dotScale: number;
  dotY: number;
};

const initialMetrics: CircleMetrics = {
  outerScale: 12,
  outerY: 0,
  innerScale: 14,
  innerY: 0,
  dotScale: 64,
  dotY: 0,
};

export function SuccessTransition({ active }: SuccessTransitionProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const outerCircleRef = useRef<HTMLDivElement>(null);
  const innerCircleRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState<CircleMetrics>(initialMetrics);

  useLayoutEffect(() => {
    const measureViewport = () => {
      const stage = stageRef.current;
      const outer = outerCircleRef.current;
      const inner = innerCircleRef.current;
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
        (zoomOriginY - (stageHeight * topRatio + diameter / 2)) * stageScale;

      setMetrics({
        outerScale: scaledCover(
          outer.offsetWidth,
          GATEWAY_MOTION.success.coverageOverscan,
        ),
        outerY: centredY(0.032787, outer.offsetWidth),
        innerScale: scaledCover(
          inner.offsetWidth,
          GATEWAY_MOTION.success.innerCoverageOverscan,
        ),
        innerY: centredY(0.217213, inner.offsetWidth),
        dotScale: scaledCover(
          dot.offsetWidth,
          GATEWAY_MOTION.success.dotCoverageOverscan,
        ),
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
                  duration: GATEWAY_MOTION.success.outerZoomDelay,
                  ease: CINEMATIC_ENTRY_EASE,
                  times: [
                    0,
                    GATEWAY_MOTION.success.reactionDuration /
                      GATEWAY_MOTION.success.outerZoomDelay,
                    1,
                  ],
                }
              : { duration: 0 }
          }
        >
          <div className="transition-disc-shell">
            <motion.div
              ref={outerCircleRef}
              className="transition-black-circle"
              initial={false}
              animate={
                active
                  ? { scale: metrics.outerScale, y: metrics.outerY }
                  : { scale: 1, y: 0 }
              }
              transition={{
                scale: {
                  delay: GATEWAY_MOTION.success.outerZoomDelay,
                  duration: GATEWAY_MOTION.success.layerZoomDuration,
                  ease: CONCENTRIC_ZOOM_EASE,
                },
                y: {
                  delay: GATEWAY_MOTION.success.outerZoomDelay,
                  duration: GATEWAY_MOTION.success.layerZoomDuration,
                  ease: CONCENTRIC_ZOOM_EASE,
                },
              }}
            />
          </div>

          <div className="transition-inner-shell">
            <motion.div
              ref={innerCircleRef}
              className="transition-white-circle"
              initial={false}
              animate={
                active
                  ? {
                      scale: metrics.innerScale,
                      y: metrics.innerY,
                      backgroundColor: "#f2efe8",
                    }
                  : { scale: 1, y: 0, backgroundColor: "#d4a64f" }
              }
              transition={{
                scale: {
                  delay: GATEWAY_MOTION.success.innerZoomDelay,
                  duration: GATEWAY_MOTION.success.layerZoomDuration,
                  ease: CONCENTRIC_ZOOM_EASE,
                },
                y: {
                  delay: GATEWAY_MOTION.success.innerZoomDelay,
                  duration: GATEWAY_MOTION.success.layerZoomDuration,
                  ease: CONCENTRIC_ZOOM_EASE,
                },
                backgroundColor: {
                  delay: GATEWAY_MOTION.success.innerZoomDelay - 0.16,
                  duration: 0.22,
                  ease: CINEMATIC_ENTRY_EASE,
                },
              }}
            />
          </div>

          <motion.div
            className="transition-crescent-shell"
            initial={false}
            animate={active ? { opacity: 0 } : { opacity: 1 }}
            transition={{
              delay: active ? GATEWAY_MOTION.success.innerZoomDelay + 0.08 : 0,
              duration: active ? 0.28 : 0,
              ease: CINEMATIC_ENTRY_EASE,
            }}
          >
            <GatewayCrescentArtwork className="forming-crescent-art" />
          </motion.div>

          <motion.div
            ref={dotRef}
            className="transition-black-dot"
            initial={false}
            animate={
              active
                ? {
                    scale: metrics.dotScale,
                    y: metrics.dotY,
                    backgroundColor: "#151411",
                  }
                : { scale: 1, y: 0, backgroundColor: "#f2efe8" }
            }
            transition={{
              scale: {
                delay: GATEWAY_MOTION.success.dotZoomDelay,
                duration: GATEWAY_MOTION.success.layerZoomDuration,
                ease: CONCENTRIC_ZOOM_EASE,
              },
              y: {
                delay: GATEWAY_MOTION.success.dotZoomDelay,
                duration: GATEWAY_MOTION.success.layerZoomDuration,
                ease: CONCENTRIC_ZOOM_EASE,
              },
              backgroundColor: {
                delay: GATEWAY_MOTION.success.dotZoomDelay - 0.14,
                duration: 0.2,
                ease: CINEMATIC_ENTRY_EASE,
              },
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
