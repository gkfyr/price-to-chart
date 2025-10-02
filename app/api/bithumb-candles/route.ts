// app/api/upbit-candles/route.ts
import { NextResponse } from "next/server";

// Ensure this route is always dynamic and never cached
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const response = await fetch(`https://api.bithumb.com/v1/candles/days?market=KRW-BTC&count=300`, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch data from Bithumb API" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "Surrogate-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error fetching candle data:", error);
    return NextResponse.json({ error: "An error occurred while fetching candle data" }, { status: 500 });
  }
}
