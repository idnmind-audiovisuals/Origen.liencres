export type UnavailableRange = {
  start: string;
  end: string;
};

function toDateKey(value: string) {
  const match = value.match(/^(\d{4})(\d{2})(\d{2})/);
  if (!match) return null;
  return `${match[1]}-${match[2]}-${match[3]}`;
}

export function parseUnavailableRanges(calendar: string) {
  const unfolded = calendar.replace(/\r?\n[ \t]/g, "");
  const events = unfolded.match(/BEGIN:VEVENT[\s\S]*?END:VEVENT/g) ?? [];
  const ranges: UnavailableRange[] = [];

  for (const event of events) {
    const startValue = event.match(/^DTSTART(?:;[^:]*)?:(.+)$/m)?.[1]?.trim();
    const endValue = event.match(/^DTEND(?:;[^:]*)?:(.+)$/m)?.[1]?.trim();
    if (!startValue || !endValue) continue;
    const start = toDateKey(startValue);
    const end = toDateKey(endValue);
    if (start && end && end > start) ranges.push({ start, end });
  }

  return ranges.sort((a, b) => a.start.localeCompare(b.start));
}

export function rangeTouchesUnavailable(
  start: string,
  end: string,
  ranges: UnavailableRange[],
) {
  return ranges.some((range) => start < range.end && end > range.start);
}

export async function loadAirbnbAvailability(options: { fresh?: boolean } = {}) {
  const calendarUrl = process.env.AIRBNB_ICAL_URL?.trim();
  if (!calendarUrl) {
    return { configured: false as const, unavailable: [] as UnavailableRange[] };
  }

  const response = await fetch(calendarUrl, options.fresh
    ? { cache: "no-store", headers: { Accept: "text/calendar" } }
    : { next: { revalidate: 10_800 }, headers: { Accept: "text/calendar" } });
  if (!response.ok) {
    throw new Error(`Calendar responded with ${response.status}`);
  }

  return {
    configured: true as const,
    unavailable: parseUnavailableRanges(await response.text()),
  };
}
