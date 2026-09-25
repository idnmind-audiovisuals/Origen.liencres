"use client";

import { MouseEvent, useState } from "react";
import Link from "next/link";
import {
  ORIGEN_HEADER_WORDMARK_BLACK_ASSET,
  ORIGEN_HEADER_WORDMARK_WHITE_ASSET,
} from "../lib/brand";

type GatewayBrandLinkProps = {
  className: string;
  label: string;
  variant?: "black" | "white";
};

export function GatewayBrandLink({
  className,
  label,
  variant = "white",
}: GatewayBrandLinkProps) {
  const [leaving, setLeaving] = useState(false);
  const wordmark = variant === "black"
    ? {
        src: ORIGEN_HEADER_WORDMARK_BLACK_ASSET,
        width: 2098,
        height: 750,
      }
    : {
        src: ORIGEN_HEADER_WORDMARK_WHITE_ASSET,
        width: 2140,
        height: 735,
      };

  async function returnToGateway(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    if (leaving) return;

    setLeaving(true);
    try {
      await fetch("/api/access", { method: "DELETE" });
    } finally {
      window.location.replace("/");
    }
  }

  return (
    <Link
      className={className}
      href="/"
      aria-label={label}
      aria-disabled={leaving || undefined}
      onClick={returnToGateway}
    >
      {/* Preserve the approved wordmark at its original proportions. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={wordmark.src}
        width={wordmark.width}
        height={wordmark.height}
        alt="Origen"
        draggable="false"
      />
    </Link>
  );
}
