"use client";

import { motion } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";
import {
  CINEMATIC_ENTRY_EASE,
  CONCENTRIC_ZOOM_EASE,
  GATEWAY_MOTION,
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
  const zoomDuration = introZoom.breathDuration + introZoom.duration;

  return (
    <motion.div
      className="gateway-intro-motion"
      ref={canvasRef}
      aria-hidden="true"
      initial={false}
      animate={opening ? "opening" : "forming"}
      variants={{
        forming: { scale: 1 },
        opening: {
          scale: [1, introZoom.breathScale, zoomScale],
          transition: {
            duration: zoomDuration,
            times: [0, introZoom.breathDuration / zoomDuration, 1],
            ease: [CINEMATIC_ENTRY_EASE, CONCENTRIC_ZOOM_EASE],
          },
        },
      }}
      onAnimationComplete={(phase) => {
        if (phase === "opening") onOpened();
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
  );
}
