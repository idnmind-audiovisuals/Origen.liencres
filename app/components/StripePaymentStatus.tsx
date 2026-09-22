"use client";

import { useEffect, useState } from "react";

type PaymentContext = "bros" | "retreat";
type PaymentStatus = {
  service?: string;
  status?: string;
  paymentStatus?: string;
  amountTotal?: number;
  currency?: string;
  arrival?: string;
  departure?: string;
  guests?: string;
  paymentKind?: string;
  error?: string;
};

export function StripePaymentStatus({ context }: { context: PaymentContext }) {
  const [notice, setNotice] = useState<{ message: string; kind: "success" | "pending" | "error" } | null>(null);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const cancelled = query.get(context === "bros" ? "subscription" : "payment") === "cancelled";
    if (cancelled) {
      queueMicrotask(() => setNotice({ message: "El pago se canceló. No se ha realizado ningún cargo.", kind: "pending" }));
      return;
    }

    const sessionId = query.get(context === "bros" ? "subscription_session" : "payment_session");
    if (!sessionId) return;
    const expectedService = context === "bros" ? "origen_bros_monthly" : "origen_retreat_stay";
    const controller = new AbortController();
    queueMicrotask(() => {
      if (!controller.signal.aborted) setNotice({ message: "Verificando el pago con Stripe…", kind: "pending" });
    });
    fetch(`/api/stripe/session?id=${encodeURIComponent(sessionId)}`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then(async (response) => {
        const result = (await response.json()) as PaymentStatus;
        if (!response.ok) throw new Error(result.error ?? "No se pudo verificar el pago.");
        return result;
      })
      .then((result) => {
        if (result.service !== expectedService) {
          setNotice({ message: "No se ha podido verificar este pago para esta página.", kind: "error" });
        } else if (result.status === "complete" && result.paymentStatus === "paid") {
          if (context === "bros") {
            setNotice({ message: "Suscripción iniciada: 100 € al mes. Recibirás la confirmación de Stripe por correo.", kind: "success" });
          } else {
            const dates = result.arrival && result.departure
              ? ` del ${result.arrival} al ${result.departure}` : "";
            setNotice({ message: `Pago recibido para la estancia${dates}. Origen confirmará las fechas contigo; el calendario de Airbnb puede tardar en sincronizarse.`, kind: "success" });
          }
        } else {
          setNotice({ message: "El pago todavía no figura como completado en Stripe. Comprueba tu correo o contacta con Origen antes de repetirlo.", kind: "pending" });
        }
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setNotice({ message: error instanceof Error ? error.message : "No se pudo verificar el pago.", kind: "error" });
        }
      });
    return () => controller.abort();
  }, [context]);

  return notice ? <p className={`stripe-payment-status is-${notice.kind}`} role="status">{notice.message}</p> : null;
}
