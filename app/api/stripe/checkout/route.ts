import { NextResponse } from "next/server";
import {
  loadAirbnbAvailability,
  rangeTouchesUnavailable,
} from "../../../lib/airbnb-calendar";
import { PUBLIC_SITE_URL } from "../../../lib/public-retreat-content";

export const dynamic = "force-dynamic";

type CheckoutKind = "retreat_full" | "retreat_deposit" | "bros_monthly";

type CheckoutRequest = {
  kind?: CheckoutKind;
  arrival?: string;
  departure?: string;
  guests?: number;
};

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DAY_MS = 86_400_000;
const MAX_RETREAT_NIGHTS = 60;

function utcDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function differenceInDays(start: string, end: string) {
  return Math.round((utcDate(end).getTime() - utcDate(start).getTime()) / DAY_MS);
}

function todayUtc() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

function error(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function appendSharedCheckoutFields(params: URLSearchParams) {
  params.set("billing_address_collection", "required");
  params.set("phone_number_collection[enabled]", "true");
  params.set("locale", "es");
}

async function createStripeSession(params: URLSearchParams) {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secretKey || !/^sk_(?:test|live)_/.test(secretKey)) {
    throw new Error("STRIPE_NOT_CONFIGURED");
  }

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
    cache: "no-store",
  });
  const session = (await response.json()) as {
    url?: string;
    error?: { message?: string };
  };

  if (!response.ok || !session.url) {
    throw new Error(session.error?.message ?? "Stripe could not create Checkout");
  }
  return session.url;
}

function configuredPrice(configuredValue: string | undefined) {
  const value = configuredValue?.trim();
  return value && /^price_[A-Za-z0-9]+$/.test(value) ? value : null;
}

export async function POST(request: Request) {
  let body: CheckoutRequest;
  try {
    body = (await request.json()) as CheckoutRequest;
  } catch {
    return error("La solicitud de pago no es válida.");
  }

  if (body.kind === "bros_monthly") {
    const price = configuredPrice(process.env.STRIPE_BROS_MONTHLY_PRICE_ID);
    if (!price) {
      return error("La suscripción todavía no está activada.", 503);
    }

    const params = new URLSearchParams({
      mode: "subscription",
      success_url: `${PUBLIC_SITE_URL}/circulo-de-hombres?subscription=success`,
      cancel_url: `${PUBLIC_SITE_URL}/circulo-de-hombres?subscription=cancelled#suscripcion`,
      "line_items[0][price]": price,
      "line_items[0][quantity]": "1",
      "metadata[service]": "origen_bros_monthly",
      "subscription_data[metadata][service]": "origen_bros_monthly",
    });
    appendSharedCheckoutFields(params);

    try {
      return NextResponse.json({ url: await createStripeSession(params) });
    } catch (checkoutError) {
      if (
        checkoutError instanceof Error &&
        checkoutError.message === "STRIPE_NOT_CONFIGURED"
      ) {
        return error("La pasarela de Stripe todavía no está activada.", 503);
      }
      return error("Stripe no ha podido iniciar la suscripción. Inténtalo de nuevo.", 502);
    }
  }

  if (body.kind !== "retreat_full" && body.kind !== "retreat_deposit") {
    return error("Selecciona una modalidad de pago válida.");
  }

  const arrival = body.arrival ?? "";
  const departure = body.departure ?? "";
  const guests = Number(body.guests);
  if (!DATE_PATTERN.test(arrival) || !DATE_PATTERN.test(departure)) {
    return error("Selecciona las fechas de llegada y salida.");
  }
  if (!Number.isInteger(guests) || guests < 1 || guests > 8) {
    return error("El número de huéspedes debe estar entre 1 y 8.");
  }

  const nights = differenceInDays(arrival, departure);
  if (nights < 1 || nights > MAX_RETREAT_NIGHTS) {
    return error(`La estancia debe tener entre 1 y ${MAX_RETREAT_NIGHTS} noches.`);
  }
  if (utcDate(arrival).getTime() < todayUtc().getTime()) {
    return error("La fecha de llegada no puede estar en el pasado.");
  }

  if (body.kind === "retreat_deposit") {
    const daysUntilArrival = Math.floor(
      (utcDate(arrival).getTime() - todayUtc().getTime()) / DAY_MS,
    );
    if (daysUntilArrival < 30) {
      return error("La reserva de 100 € requiere al menos 30 días de antelación.");
    }
  }

  let availability: Awaited<ReturnType<typeof loadAirbnbAvailability>>;
  try {
    availability = await loadAirbnbAvailability();
  } catch {
    return error("No podemos confirmar la disponibilidad ahora mismo.", 503);
  }
  if (!availability.configured) {
    return error(
      "La disponibilidad automática debe estar conectada antes de aceptar pagos.",
      503,
    );
  }
  if (rangeTouchesUnavailable(arrival, departure, availability.unavailable)) {
    return error("Las fechas seleccionadas ya no están disponibles.", 409);
  }

  const price =
    body.kind === "retreat_full"
      ? configuredPrice(process.env.STRIPE_RETREAT_NIGHT_PRICE_ID)
      : configuredPrice(process.env.STRIPE_RETREAT_DEPOSIT_PRICE_ID);
  if (!price) {
    return error("Esta modalidad de pago todavía no está activada.", 503);
  }

  const kindLabel = body.kind === "retreat_full" ? "full_stay" : "deposit";
  const total = nights * 500;
  const params = new URLSearchParams({
    mode: "payment",
    success_url: `${PUBLIC_SITE_URL}/retiro?payment=success#reservar`,
    cancel_url: `${PUBLIC_SITE_URL}/retiro?payment=cancelled#reservar`,
    submit_type: "book",
    customer_creation: "always",
    client_reference_id: `origen-${arrival}-${departure}-${kindLabel}`,
    "line_items[0][price]": price,
    "line_items[0][quantity]": body.kind === "retreat_full" ? String(nights) : "1",
    "metadata[service]": "origen_retreat_stay",
    "metadata[payment_kind]": kindLabel,
    "metadata[arrival]": arrival,
    "metadata[departure]": departure,
    "metadata[nights]": String(nights),
    "metadata[guests]": String(guests),
    "metadata[stay_total_eur]": String(total),
    "payment_intent_data[metadata][service]": "origen_retreat_stay",
    "payment_intent_data[metadata][payment_kind]": kindLabel,
    "payment_intent_data[metadata][arrival]": arrival,
    "payment_intent_data[metadata][departure]": departure,
  });
  appendSharedCheckoutFields(params);

  try {
    return NextResponse.json({ url: await createStripeSession(params) });
  } catch (checkoutError) {
    if (
      checkoutError instanceof Error &&
      checkoutError.message === "STRIPE_NOT_CONFIGURED"
    ) {
      return error("La pasarela de Stripe todavía no está activada.", 503);
    }
    return error("Stripe no ha podido iniciar el pago. Inténtalo de nuevo.", 502);
  }
}
