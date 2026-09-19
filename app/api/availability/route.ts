import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type DateRange = {
  start: string;
  end: string;
};

function toDateKey(value: string) {
  const match = value.match(/^(\d{4})(\d{2})(\d{2})/);
  if (!match) return null;
  return `${match[1]}-${match[2]}-${match[3]}`;
}

function parseUnavailableRanges(calendar: string) {
  const unfolded = calendar.replace(/\r?\n[ \t]/g, "");
  const events = unfolded.match(/BEGIN:VEVENT[\s\S]*?END:VEVENT/g) ?? [];
  const ranges: DateRange[] = [];

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

export async function GET() {
  const calendarUrl = process.env.AIRBNB_ICAL_URL?.trim();
  if (!calendarUrl) {
    return NextResponse.json(
      { configured: false, unavailable: [] },
      { headers: { "Cache-Control": "public, s-maxage=300" } },
    );
  }

  try {
    const response = await fetch(calendarUrl, {
      next: { revalidate: 10_800 },
      headers: { Accept: "text/calendar" },
    });
    if (!response.ok) throw new Error(`Calendar responded with ${response.status}`);
    const calendar = await response.text();
    return NextResponse.json(
      {
        configured: true,
        unavailable: parseUnavailableRanges(calendar),
        checkedAt: new Date().toISOString(),
      },
      { headers: { "Cache-Control": "public, s-maxage=10800, stale-while-revalidate=3600" } },
    );
  } catch {
    return NextResponse.json(
      { configured: false, unavailable: [], temporaryError: true },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
