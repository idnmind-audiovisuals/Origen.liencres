export const RETREAT_BASE_NIGHT_EUR = 390;
export const RETREAT_DEPOSIT_PER_NIGHT_EUR = 100;
export const RETREAT_MAX_GUESTS = 9;
export const RETREAT_MAX_NIGHTS = 60;
export const RETREAT_LAUNCH_DISCOUNT_PERCENT = 30;
export const RETREAT_LAUNCH_YEAR = 2026;

const DAY_MS = 86_400_000;
const BASE_NIGHT_CENTS = RETREAT_BASE_NIGHT_EUR * 100;

export type RetreatQuote = {
  nights: number;
  highSeasonNights: number;
  baseCents: number;
  highSeasonSurchargeCents: number;
  stayDiscountPercent: number;
  launchDiscountPercent: number;
  discountSource: "launch" | "stay" | null;
  discountPercent: number;
  discountCents: number;
  totalCents: number;
  depositCents: number;
  balanceDueCents: number;
};

export function isOctoberLaunchBooking(bookingDate = new Date()) {
  if (!Number.isFinite(bookingDate.getTime())) return false;
  const madridDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(bookingDate);
  const year = Number(madridDate.find((part) => part.type === "year")?.value);
  const month = Number(madridDate.find((part) => part.type === "month")?.value);
  return year === RETREAT_LAUNCH_YEAR && month === 10;
}

function utcDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toISOString().slice(0, 10) === value ? date : null;
}

function isHighSeasonNight(date: Date) {
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  return (
    month === 7 ||
    month === 8 ||
    (month === 12 && day >= 20) ||
    (month === 1 && day <= 6)
  );
}

export function calculateRetreatQuote(
  arrival: string,
  departure: string,
  bookingDate = new Date(),
): RetreatQuote | null {
  const start = utcDate(arrival);
  const end = utcDate(departure);
  if (!start || !end) return null;

  const nights = Math.round((end.getTime() - start.getTime()) / DAY_MS);
  if (nights < 1 || nights > RETREAT_MAX_NIGHTS) return null;

  let highSeasonNights = 0;
  for (let index = 0; index < nights; index += 1) {
    if (isHighSeasonNight(new Date(start.getTime() + index * DAY_MS))) {
      highSeasonNights += 1;
    }
  }

  const baseCents = nights * BASE_NIGHT_CENTS;
  const highSeasonSurchargeCents = highSeasonNights * Math.round(BASE_NIGHT_CENTS * 0.3);
  const subtotalCents = baseCents + highSeasonSurchargeCents;
  const stayDiscountPercent = nights >= 7 ? 30 : nights >= 3 ? 20 : 0;
  const launchDiscountPercent = isOctoberLaunchBooking(bookingDate)
    ? RETREAT_LAUNCH_DISCOUNT_PERCENT
    : 0;
  const discountPercent = Math.max(stayDiscountPercent, launchDiscountPercent);
  const discountSource = launchDiscountPercent >= stayDiscountPercent && launchDiscountPercent > 0
    ? "launch"
    : stayDiscountPercent > 0
      ? "stay"
      : null;
  const discountCents = Math.round((subtotalCents * discountPercent) / 100);
  const totalCents = subtotalCents - discountCents;
  const depositCents = nights * RETREAT_DEPOSIT_PER_NIGHT_EUR * 100;

  return {
    nights,
    highSeasonNights,
    baseCents,
    highSeasonSurchargeCents,
    stayDiscountPercent,
    launchDiscountPercent,
    discountSource,
    discountPercent,
    discountCents,
    totalCents,
    depositCents,
    balanceDueCents: totalCents - depositCents,
  };
}
