import { NextResponse } from "next/server";
import { loadAirbnbAvailability } from "../../lib/airbnb-calendar";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const availability = await loadAirbnbAvailability();
    return NextResponse.json(
      {
        ...availability,
        ...(availability.configured
          ? { checkedAt: new Date().toISOString() }
          : {}),
      },
      {
        headers: {
          "Cache-Control": availability.configured
            ? "public, s-maxage=10800, stale-while-revalidate=3600"
            : "public, s-maxage=300",
        },
      },
    );
  } catch {
    return NextResponse.json(
      { configured: false, unavailable: [], temporaryError: true },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
