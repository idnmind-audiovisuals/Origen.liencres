"use client";

import { useState } from "react";
import { AccessKeyForm } from "./AccessKeyForm";
import { OpenedState } from "./OpenedState";
import { ORIGEN_SYMBOL_ASSET } from "../lib/brand";

type ReducedMotionGatewayProps = {
  development: boolean;
  initiallyAuthenticated: boolean;
  onOpened?: () => void;
};

export function ReducedMotionGateway({
  development,
  initiallyAuthenticated,
  onOpened,
}: ReducedMotionGatewayProps) {
  const [opened, setOpened] = useState(initiallyAuthenticated);
  const [errorPulse, setErrorPulse] = useState(0);

  async function resetSession() {
    await fetch("/api/access", { method: "DELETE" });
    window.location.reload();
  }

  if (opened) {
    return <OpenedState development={development} onReset={resetSession} />;
  }

  return (
    <main className="gateway gateway-reduced" data-error={errorPulse || undefined}>
      <h1 className="sr-only">Origen access gateway</h1>
      <section className="symbol-stage reduced-symbol" aria-label="Origen access">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="reduced-symbol-image"
          src={ORIGEN_SYMBOL_ASSET}
          width="283"
          height="244"
          alt="Origen"
          draggable="false"
        />
        <AccessKeyForm
          visible
          disabled={false}
          reducedMotion
          onIncorrect={() => setErrorPulse((current) => current + 1)}
          onSuccess={() => {
            setOpened(true);
            onOpened?.();
          }}
        />
      </section>
    </main>
  );
}
