import { NextResponse } from "next/server";
import { loadAirbnbAvailability } from "../../lib/airbnb-calendar";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const availability = await loadAirbnbAvailability({ fresh: true });
    return NextResponse.json(
      {
        ...availability,
        ...(availability.configured
          ? { checkedAt: new Date().toISOString() }
          : {}),
      },
      {
        headers: {
          "Cache-Control": "no-store",
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
