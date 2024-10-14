// app/api/getCandleData/route.ts

import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1h&limit=150");
    if (!response.ok) {
      const errorText = await response.text(); // 응답 본문을 가져와서 에러 원인 확인
      console.error(
        `Failed to fetch data from Binance API: ${response.status} - ${response.statusText} - ${errorText}`
      );
      throw new Error(`Failed to fetch data from Binance API: ${response.statusText} (${response.status})`);
    }

    const data = await response.json();

    // 필요한 형태로 데이터를 변환 (타임스탬프, 시가, 고가, 저가, 종가)
    const formattedData = data.map((candle: any) => ({
      time: candle[0] / 1000, // Unix timestamp (초 단위)
      open: parseFloat(candle[1]),
      high: parseFloat(candle[2]),
      low: parseFloat(candle[3]),
      close: parseFloat(candle[4]),
    }));

    return NextResponse.json({ candles: formattedData });
  } catch (error) {
    console.error("Error fetching candle data from Binance:", error);
    return NextResponse.json({ error: "Failed to fetch candle data" }, { status: 500 });
  }
}
