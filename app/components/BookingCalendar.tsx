"use client";

import { useEffect, useMemo, useState } from "react";
import { ORIGEN_AIRBNB_URL, HOST_APPLICATION_URL } from "../lib/public-retreat-content";
import {
  calculateRetreatQuote,
  RETREAT_BASE_NIGHT_EUR,
  RETREAT_MAX_GUESTS,
} from "../lib/retreat-pricing";
import { StripeCheckoutButton } from "./StripeCheckoutButton";

type UnavailableRange = {
  start: string;
  end: string;
};

type AvailabilityResponse = {
  configured: boolean;
  unavailable: UnavailableRange[];
};

const MONTHS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function addMonths(date: Date, count: number) {
  return new Date(date.getFullYear(), date.getMonth() + count, 1);
}

function formatSelectedDate(value: string | null) {
  if (!value) return "Añadir fecha";
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parseDate(value));
}

function formatEuros(cents: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

function isUnavailable(value: string, ranges: UnavailableRange[]) {
  return ranges.some((range) => value >= range.start && value < range.end);
}

function rangeTouchesUnavailable(start: string, end: string, ranges: UnavailableRange[]) {
  return ranges.some((range) => start < range.end && end > range.start);
}

function monthDays(month: Date) {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  const mondayOffset = (firstDay.getDay() + 6) % 7;
  const cells: Array<Date | null> = Array.from({ length: mondayOffset }, () => null);
  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    cells.push(new Date(month.getFullYear(), month.getMonth(), day));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function Month({
  month,
  arrival,
  departure,
  unavailable,
  onSelect,
}: {
  month: Date;
  arrival: string | null;
  departure: string | null;
  unavailable: UnavailableRange[];
  onSelect: (value: string) => void;
}) {
  const today = dateKey(new Date());
  return (
    <section className="booking-month" aria-label={`${MONTHS[month.getMonth()]} ${month.getFullYear()}`}>
      <h3>{MONTHS[month.getMonth()]} <span>{month.getFullYear()}</span></h3>
      <div className="booking-weekdays" aria-hidden="true">
        {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day) => <span key={day}>{day}</span>)}
      </div>
      <div className="booking-days">
        {monthDays(month).map((date, index) => {
          if (!date) return <span className="booking-day-spacer" key={`empty-${index}`} />;
          const key = dateKey(date);
          const blocked = key < today || isUnavailable(key, unavailable);
          const selected = key === arrival || key === departure;
          const withinRange = Boolean(arrival && departure && key > arrival && key < departure);
          return (
            <button
              type="button"
              key={key}
              disabled={blocked}
              className={`${selected ? "is-selected " : ""}${withinRange ? "is-in-range" : ""}`.trim()}
              onClick={() => onSelect(key)}
              aria-pressed={selected}
              aria-label={`${date.getDate()} de ${MONTHS[date.getMonth()]} de ${date.getFullYear()}${blocked ? ", no disponible" : ""}`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function BookingCalendar() {
  const currentMonth = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }, []);
  const [visibleMonth, setVisibleMonth] = useState(currentMonth);
  const [arrival, setArrival] = useState<string | null>(null);
  const [departure, setDeparture] = useState<string | null>(null);
  const [guests, setGuests] = useState(8);
  const [unavailable, setUnavailable] = useState<UnavailableRange[]>([]);
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Selecciona llegada y salida.");
  const [checkoutError, setCheckoutError] = useState("");
  const [openPicker, setOpenPicker] = useState<"arrival" | "departure" | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/availability")
      .then((response) => response.json() as Promise<AvailabilityResponse>)
      .then((data) => {
        if (!active) return;
        setUnavailable(data.unavailable ?? []);
        setCalendarConnected(Boolean(data.configured));
      })
      .catch(() => {
        if (active) setCalendarConnected(false);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  function selectDate(value: string) {
    if (openPicker === "arrival" || !arrival || (departure && !openPicker)) {
      setArrival(value);
      setDeparture(null);
      setOpenPicker(openPicker ? "departure" : null);
      setMessage("Ahora selecciona la fecha de salida.");
      return;
    }
    if (value <= arrival) {
      setArrival(value);
      setDeparture(null);
      setMessage("Ahora selecciona la fecha de salida.");
      return;
    }
    if (rangeTouchesUnavailable(arrival, value, unavailable)) {
      setMessage("Ese intervalo contiene noches no disponibles. Elige otras fechas.");
      return;
    }
    setDeparture(value);
    setOpenPicker(null);
    setMessage("Fechas seleccionadas. Elige pago completo o reserva anticipada.");
  }

  function openDatePicker(field: "arrival" | "departure") {
    const selectedDate = field === "arrival" ? arrival : departure ?? arrival;
    if (selectedDate) {
      const date = parseDate(selectedDate);
      setVisibleMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    }
    setOpenPicker(field);
    setMessage(field === "arrival" || !arrival ? "Selecciona la fecha de llegada." : "Selecciona la fecha de salida.");
  }

  const bookingUrl = useMemo(() => {
    const url = new URL(ORIGEN_AIRBNB_URL);
    url.searchParams.delete("modal");
    if (arrival) url.searchParams.set("check_in", arrival);
    if (departure) url.searchParams.set("check_out", departure);
    url.searchParams.set("adults", String(guests));
    return url.toString();
  }, [arrival, departure, guests]);

  const canMoveBack = visibleMonth > currentMonth;
  const quote = useMemo(
    () => (arrival && departure ? calculateRetreatQuote(arrival, departure) : null),
    [arrival, departure],
  );
  const depositEligible = useMemo(() => {
    if (!arrival || !departure) return false;
    const now = new Date();
    const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    const arrivalDate = parseDate(arrival);
    return (
      (Date.UTC(arrivalDate.getFullYear(), arrivalDate.getMonth(), arrivalDate.getDate()) - today) / 86_400_000 >= 30
    );
  }, [arrival, departure]);
  const checkoutPayload = { arrival, departure, guests };
  const stripeReady = Boolean(quote && calendarConnected);

  const datePicker = openPicker ? (
    <div
      className="booking-date-popover"
      id="booking-date-picker"
      role="dialog"
      aria-label={openPicker === "arrival" || !arrival ? "Seleccionar llegada" : "Seleccionar salida"}
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpenPicker(null);
      }}
    >
      <div className="booking-date-popover-heading">
        <span>{openPicker === "arrival" || !arrival ? "Selecciona la llegada" : "Selecciona la salida"}</span>
        <button type="button" onClick={() => setOpenPicker(null)} aria-label="Cerrar calendario">×</button>
      </div>
      <div className="booking-calendar-nav">
        <button type="button" onClick={() => setVisibleMonth(addMonths(visibleMonth, -1))} disabled={!canMoveBack} aria-label="Mes anterior">←</button>
        <span aria-hidden="true" />
        <button type="button" onClick={() => setVisibleMonth(addMonths(visibleMonth, 1))} aria-label="Mes siguiente">→</button>
      </div>
      <Month month={visibleMonth} arrival={arrival} departure={departure} unavailable={unavailable} onSelect={selectDate} />
    </div>
  ) : null;

  return (
    <section className="booking-panel" id="reservar" aria-labelledby="booking-title">
      <div className="booking-panel-heading scroll-reveal">
        <div>
          <p className="retreat-public-eyebrow">Disponibilidad y reserva</p>
          <h2 id="booking-title">Encuentra tus fechas.</h2>
        </div>
        <p>
          Tarifa base: {RETREAT_BASE_NIGHT_EUR} € por noche. A partir de 3 noches,
          20 % de descuento; desde 7 noches, 30 %. Las noches de julio, agosto y
          del 20 de diciembre al 6 de enero llevan un recargo del 30 %. El
          precio final se muestra antes de pagar.
        </p>
      </div>

      <div className="booking-layout">
        <div className="booking-calendar-card">
          <div className="booking-calendar-nav">
            <button type="button" onClick={() => setVisibleMonth(addMonths(visibleMonth, -1))} disabled={!canMoveBack} aria-label="Mes anterior">←</button>
            <p>{loading ? "Actualizando calendario…" : calendarConnected ? "Conectado con Airbnb" : "Disponibilidad final en Airbnb"}</p>
            <button type="button" onClick={() => setVisibleMonth(addMonths(visibleMonth, 1))} aria-label="Mes siguiente">→</button>
          </div>
          <div className="booking-months">
            <Month month={visibleMonth} arrival={arrival} departure={departure} unavailable={unavailable} onSelect={selectDate} />
            <Month month={addMonths(visibleMonth, 1)} arrival={arrival} departure={departure} unavailable={unavailable} onSelect={selectDate} />
          </div>
          <p className="booking-calendar-message" role="status">{message}</p>
        </div>

        <aside className="booking-summary" aria-label="Resumen de reserva">
          <div>
            <p className="retreat-public-eyebrow">Uso exclusivo</p>
            <h3>Reserva la casa completa.</h3>
            <p>Tarifa base de {RETREAT_BASE_NIGHT_EUR} € por noche para el grupo completo, hasta {RETREAT_MAX_GUESTS} huéspedes.</p>
          </div>
          <dl>
            <div className="booking-date-row">
              <dt>Llegada</dt>
              <dd>
                <button type="button" className="booking-date-trigger" onClick={() => openDatePicker("arrival")} aria-haspopup="dialog" aria-expanded={openPicker === "arrival"} aria-controls={openPicker === "arrival" ? "booking-date-picker" : undefined}>
                  {formatSelectedDate(arrival)}
                </button>
              </dd>
              {openPicker === "arrival" ? datePicker : null}
            </div>
            <div className="booking-date-row">
              <dt>Salida</dt>
              <dd>
                <button type="button" className="booking-date-trigger" onClick={() => openDatePicker("departure")} aria-haspopup="dialog" aria-expanded={openPicker === "departure"} aria-controls={openPicker === "departure" ? "booking-date-picker" : undefined}>
                  {formatSelectedDate(departure)}
                </button>
              </dd>
              {openPicker === "departure" ? datePicker : null}
            </div>
            <div>
              <dt>Huéspedes</dt>
              <dd>
                <button type="button" onClick={() => setGuests((value) => Math.max(1, value - 1))} aria-label="Reducir huéspedes">−</button>
                <span>{guests}</span>
                <button type="button" onClick={() => setGuests((value) => Math.min(RETREAT_MAX_GUESTS, value + 1))} aria-label="Añadir huéspedes">+</button>
              </dd>
            </div>
            {quote ? (
              <>
                <div><dt>{quote.nights} {quote.nights === 1 ? "noche" : "noches"} × {RETREAT_BASE_NIGHT_EUR} €</dt><dd>{formatEuros(quote.baseCents)}</dd></div>
                {quote.highSeasonNights ? <div><dt>Temporada alta · {quote.highSeasonNights} {quote.highSeasonNights === 1 ? "noche" : "noches"} (+30 %)</dt><dd>+{formatEuros(quote.highSeasonSurchargeCents)}</dd></div> : null}
                {quote.discountPercent ? <div><dt>Descuento por estancia · {quote.discountPercent} %</dt><dd>−{formatEuros(quote.discountCents)}</dd></div> : null}
              </>
            ) : null}
            <div>
              <dt>Total estancia</dt>
              <dd>{quote ? formatEuros(quote.totalCents) : "Selecciona fechas"}</dd>
            </div>
          </dl>
          <StripeCheckoutButton
            kind="retreat_full"
            label={quote ? `Pagar estancia · ${formatEuros(quote.totalCents)}` : "Selecciona fechas para pagar"}
            className="booking-primary"
            disabled={!stripeReady}
            payload={checkoutPayload}
            onError={setCheckoutError}
          />
          <StripeCheckoutButton
            kind="retreat_deposit"
            label="Reservar con 100 €"
            className="booking-deposit"
            disabled={!stripeReady || !depositEligible}
            payload={checkoutPayload}
            onError={setCheckoutError}
          />
          <p className="booking-deposit-note">
            El anticipo de 100 € está disponible con 30 días de antelación. El
            importe restante{quote ? ` (${formatEuros(quote.totalCents - 10_000)})` : ""} se coordina por separado.
          </p>
          {checkoutError ? (
            <p className="booking-checkout-error" role="alert">{checkoutError}</p>
          ) : null}
          <a className="booking-airbnb" href={bookingUrl} target="_blank" rel="noreferrer">
            Comprobar en Airbnb
            <span className="external-link-dot" aria-hidden="true" />
          </a>
          <a className="booking-secondary" href={HOST_APPLICATION_URL} target="_blank" rel="noreferrer">Proponer un retiro</a>
          <small>Los pagos se procesan de forma segura en Stripe. La sincronización del calendario de Airbnb puede tardar unas horas.</small>
        </aside>
      </div>
    </section>
  );
}
