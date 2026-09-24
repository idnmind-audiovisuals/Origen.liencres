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
  const filterId = `gateway-crescent-alpha-${artworkId}`;

  return (
    <svg
      className={className}
      viewBox="0 0 283 244"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <filter id={filterId} colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="
              0 0 0 0 1
              0 0 0 0 1
              0 0 0 0 1
              -0.2126 -0.7152 -0.0722 0 1
            "
          />
          <feComponentTransfer>
            <feFuncA type="linear" slope="1.25" intercept="-0.08" />
          </feComponentTransfer>
        </filter>
      </defs>
      <image
        href={ORIGEN_SYMBOL_ASSET}
        width="283"
        height="244"
        filter={`url(#${filterId})`}
      />
      <circle cx="141.5" cy="170" r="24" fill="var(--ink)" />
    </svg>
  );
}
