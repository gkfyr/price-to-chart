// app/api/upbit-candles/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://api.upbit.com/v1/candles/days?market=KRW-BTC&count=150", {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch data from Upbit API" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching candle data:", error);
    return NextResponse.json({ error: "An error occurred while fetching candle data" }, { status: 500 });
  }
}
