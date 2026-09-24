"use client";

import { useId } from "react";
import { ORIGEN_SYMBOL_ASSET } from "../lib/brand";

type GatewayCrescentArtworkProps = {
  className?: string;
};

export function GatewayCrescentArtwork({
  className,
}: GatewayCrescentArtworkProps) {
  const artworkId = useId().replaceAll(":", "");
  const filterId = `gateway-crescent-${artworkId}`;
  const clipId = `gateway-disc-${artworkId}`;

  return (
    <svg
      className={className}
      viewBox="0 0 283 244"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id={clipId}>
          <circle cx="141.5" cy="141.5" r="133.5" />
        </clipPath>
        <filter id={filterId} colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="
              -0.980952 0 0 0 1.07212
              0 -0.990291 0 0 1.06541
              0 0 -0.990148 0 1.022409
              0 0 0 1 0
            "
          />
        </filter>
      </defs>
      <image
        href={ORIGEN_SYMBOL_ASSET}
        width="283"
        height="244"
        filter={`url(#${filterId})`}
        clipPath={`url(#${clipId})`}
      />
      <circle cx="141.5" cy="170" r="24" fill="var(--ink)" />
    </svg>
  );
}
