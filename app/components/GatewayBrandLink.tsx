"use client";

import { MouseEvent, useState } from "react";
import Link from "next/link";
import { ORIGEN_WORDMARK_ASSET } from "../lib/brand";

type GatewayBrandLinkProps = {
  className: string;
  label: string;
};

export function GatewayBrandLink({
  className,
  label,
}: GatewayBrandLinkProps) {
  const [leaving, setLeaving] = useState(false);

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
        src={ORIGEN_WORDMARK_ASSET}
        width="1090"
        height="296"
        alt="Origen"
        draggable="false"
      />
    </Link>
  );
}
