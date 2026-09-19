"use client";

import { useState } from "react";

type CheckoutKind = "retreat_full" | "retreat_deposit" | "bros_monthly";

type StripeCheckoutButtonProps = {
  kind: CheckoutKind;
  label: string;
  className: string;
  disabled?: boolean;
  payload?: {
    arrival: string | null;
    departure: string | null;
    guests: number;
  };
  onError?: (message: string) => void;
};

export function StripeCheckoutButton({
  kind,
  label,
  className,
  disabled = false,
  payload,
  onError,
}: StripeCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  async function beginCheckout() {
    if (disabled || loading) return;
    setLoading(true);
    onError?.("");

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, ...payload }),
      });
      const result = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !result.url) {
        throw new Error(result.error ?? "No se ha podido iniciar el pago.");
      }
      window.location.assign(result.url);
    } catch (checkoutError) {
      onError?.(
        checkoutError instanceof Error
          ? checkoutError.message
          : "No se ha podido iniciar el pago.",
      );
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      className={className}
      disabled={disabled || loading}
      onClick={beginCheckout}
    >
      {loading ? "Conectando con Stripe…" : label}
      <span className="external-link-dot" aria-hidden="true" />
    </button>
  );
}
