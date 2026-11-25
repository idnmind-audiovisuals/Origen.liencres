export const RETREAT_NIGHTLY_RATES_EUR = {
  low: { weekday: 332, weekend: 349 },
  high: { weekday: 349, weekend: 359 },
} as const;
export const RETREAT_DEPOSIT_PER_NIGHT_EUR = 100;
export const RETREAT_MAX_GUESTS = 9;
export const RETREAT_MAX_NIGHTS = 60;
export const RETREAT_WEEKLY_DISCOUNT_PERCENT = 15;
export const RETREAT_WEEKLY_MIN_NIGHTS = 7;

const DAY_MS = 86_400_000;
const SEASONS = ["low", "high"] as const;
const DAY_TYPES = ["weekday", "weekend"] as const;

type RateLine = {
  season: (typeof SEASONS)[number];
  dayType: (typeof DAY_TYPES)[number];
  nights: number;
  nightlyRateEur: number;
  subtotalCents: number;
};

export type RetreatQuote = {
  nights: number;
  highSeasonNights: number;
  rateLines: RateLine[];
  subtotalCents: number;
  discountPercent: number;
  discountCents: number;
  totalCents: number;
  depositCents: number;
  balanceDueCents: number;
};

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
): RetreatQuote | null {
  const start = utcDate(arrival);
  const end = utcDate(departure);
  if (!start || !end) return null;

  const nights = Math.round((end.getTime() - start.getTime()) / DAY_MS);
  if (nights < 1 || nights > RETREAT_MAX_NIGHTS) return null;

  const counts = {
    low: { weekday: 0, weekend: 0 },
    high: { weekday: 0, weekend: 0 },
  };
  for (let index = 0; index < nights; index += 1) {
    const date = new Date(start.getTime() + index * DAY_MS);
    const season = isHighSeasonNight(date) ? "high" : "low";
    const day = date.getUTCDay();
    const dayType = day === 5 || day === 6 ? "weekend" : "weekday";
    counts[season][dayType] += 1;
  }

  const rateLines = SEASONS.flatMap((season) => DAY_TYPES.flatMap((dayType) => {
    const count = counts[season][dayType];
    if (!count) return [];
    const nightlyRateEur = RETREAT_NIGHTLY_RATES_EUR[season][dayType];
    return [{ season, dayType, nights: count, nightlyRateEur, subtotalCents: count * nightlyRateEur * 100 }];
  }));
  const subtotalCents = rateLines.reduce((total, line) => total + line.subtotalCents, 0);
  const discountPercent = nights >= RETREAT_WEEKLY_MIN_NIGHTS ? RETREAT_WEEKLY_DISCOUNT_PERCENT : 0;
  const discountCents = Math.round((subtotalCents * discountPercent) / 100);
  const totalCents = subtotalCents - discountCents;
  const depositCents = nights * RETREAT_DEPOSIT_PER_NIGHT_EUR * 100;

  return {
    nights,
    highSeasonNights: counts.high.weekday + counts.high.weekend,
    rateLines,
    subtotalCents,
    discountPercent,
    discountCents,
    totalCents,
    depositCents,
    balanceDueCents: totalCents - depositCents,
  };
}
