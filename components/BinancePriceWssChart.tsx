"use client";

import { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

const EthCandleChartWss = () => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const candleSeriesRef = useRef<any>(null);

  // REST API로 과거 캔들 데이터를 가져오는 함수
  const fetchCandleData = async () => {
    try {
      const response = await fetch("https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1h&limit=150");
      const data = await response.json();
      const formattedData = data.map((candle: any) => ({
        time: candle[0] / 1000, // Unix timestamp (초 단위)
        open: parseFloat(candle[1]),
        high: parseFloat(candle[2]),
        low: parseFloat(candle[3]),
        close: parseFloat(candle[4]),
      }));
      return formattedData;
    } catch (error) {
      console.error("Error fetching candle data:", error);
      return [];
    }
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // 차트 생성
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
      },
      layout: {
        background: { color: "#222" },
        textColor: "#DDD",
      },
      grid: {
        vertLines: { color: "#444" },
        horzLines: { color: "#444" },
      },
    });

    // 캔들 시리즈 추가
    const candleSeries = chart.addCandlestickSeries();
    candleSeriesRef.current = candleSeries;

    // 차트 크기 조정 시 크기 동적 변경
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener("resize", handleResize);

    // REST API로 과거 데이터를 불러와 차트에 설정
    fetchCandleData().then((candles) => {
      if (candleSeriesRef.current) {
        candleSeriesRef.current.setData(candles);
      }
    });

    // 웹소켓 연결을 통한 실시간 데이터 수신
    const socket = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@kline_1h");

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message && message.k) {
        const candlestick = message.k;

        const updatedCandle = {
          time: candlestick.t / 1000, // Unix timestamp (초 단위)
          open: parseFloat(candlestick.o),
          high: parseFloat(candlestick.h),
          low: parseFloat(candlestick.l),
          close: parseFloat(candlestick.c),
        };

        // 실시간 캔들 데이터 업데이트
        candleSeriesRef.current.update(updatedCandle);
      }
    };

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      socket.close(); // 웹소켓 연결 종료
      chart.remove();
    };
  }, []);

  return <div ref={chartContainerRef} />;
};

export default EthCandleChartWss;
