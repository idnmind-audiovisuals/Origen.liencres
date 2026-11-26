"use client";

import { motion } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";
import {
  CINEMATIC_ENTRY_EASE,
  CONCENTRIC_ZOOM_EASE,
  GATEWAY_MOTION,
  getDotZoomKeyframes,
  getPortalZoomScale,
  LIGHT_EMERGENCE_EASE,
  ORGANIC_EASE,
} from "../lib/gateway-motion";
import { GatewayCrescentArtwork } from "./GatewayCrescentArtwork";

type OrigenSymbolAnimationProps = {
  opening: boolean;
  onOpened: () => void;
};

export function OrigenSymbolAnimation({
  opening,
  onOpened,
}: OrigenSymbolAnimationProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [zoomScale, setZoomScale] = useState(1);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const dot = dotRef.current;
    if (!canvas || !dot) return;

    const measure = () => {
      // Read layout dimensions so the measurement does not change during the zoom.
      const originY = parseFloat(getComputedStyle(canvas).transformOrigin.split(" ")[1]);
      setZoomScale(
        getPortalZoomScale(canvas.clientWidth, canvas.clientHeight, originY, dot.offsetWidth),
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(canvas);
    observer.observe(dot);
    return () => observer.disconnect();
  }, []);

  const { introZoom, firstLight, innerLight, centreDot } = GATEWAY_MOTION;
  const phase = opening ? "opening" : "forming";

  return (
    <div className="gateway-intro-motion" aria-hidden="true">
      <motion.div
        className="gateway-zoom-layer gateway-crescent-zoom"
        initial={false}
        animate={phase}
        variants={{
          forming: { scale: 1 },
          opening: {
            scale: [...introZoom.crescentScales],
            transition: {
              duration: introZoom.duration,
              times: [...introZoom.crescentTimes],
              ease: [CINEMATIC_ENTRY_EASE, CONCENTRIC_ZOOM_EASE, ORGANIC_EASE],
            },
          },
        }}
      >
        <motion.div
          className="first-light"
          initial={{ opacity: 0, scale: 0.0002 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...firstLight, ease: LIGHT_EMERGENCE_EASE }}
        />
        <div className="symbol-positioner">
          <div className="symbol-stage">
            <motion.div
              className="forming-crescent-shell"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...innerLight, ease: ORGANIC_EASE }}
            >
              <GatewayCrescentArtwork className="forming-crescent-art" />
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="gateway-zoom-layer gateway-dot-zoom"
        ref={canvasRef}
        initial={false}
        animate={phase}
        variants={{
          forming: { scale: 1 },
          opening: {
            scale: getDotZoomKeyframes(zoomScale),
            transition: {
              duration: introZoom.duration,
              times: [...introZoom.dotTimes],
              ease: [CINEMATIC_ENTRY_EASE, CONCENTRIC_ZOOM_EASE, ORGANIC_EASE],
            },
          },
        }}
        onAnimationComplete={(completed) => {
          if (completed === "opening") onOpened();
        }}
      >
        <div className="symbol-positioner">
          <div className="symbol-stage">
            <motion.div
              className="forming-dot"
              ref={dotRef}
              initial={{ opacity: 0, scale: 0.15 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...centreDot, ease: ORGANIC_EASE }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
