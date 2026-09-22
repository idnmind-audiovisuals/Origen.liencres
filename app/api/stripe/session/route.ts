import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type StripeSession = {
  status?: string;
  payment_status?: string;
  mode?: string;
  currency?: string;
  amount_total?: number;
  metadata?: Record<string, string>;
};

export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get("id") ?? "";
  if (!/^cs_(?:test|live)_[A-Za-z0-9]+$/.test(sessionId)) {
    return NextResponse.json({ error: "Sesión de pago no válida." }, { status: 400 });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secretKey || !/^sk_(?:test|live)_/.test(secretKey)) {
    return NextResponse.json({ error: "Stripe no está configurado." }, { status: 503 });
  }

  try {
    const response = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
      { headers: { Authorization: `Bearer ${secretKey}` }, cache: "no-store" },
    );
    if (!response.ok) {
      return NextResponse.json({ error: "No se ha podido verificar el pago." }, { status: 502 });
    }
    const session = (await response.json()) as StripeSession;
    const service = session.metadata?.service;
    if (service !== "origen_bros_monthly" && service !== "origen_retreat_stay") {
      return NextResponse.json({ error: "Sesión de pago no válida." }, { status: 404 });
    }
    return NextResponse.json({
      service,
      status: session.status,
      paymentStatus: session.payment_status,
      mode: session.mode,
      currency: session.currency,
      amountTotal: session.amount_total,
      ...(service === "origen_retreat_stay"
        ? {
            arrival: session.metadata?.arrival,
            departure: session.metadata?.departure,
            guests: session.metadata?.guests,
            paymentKind: session.metadata?.payment_kind,
          }
        : {}),
    }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "No se ha podido verificar el pago." }, { status: 502 });
  }
}
