"use client";

import { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

const UpbitPriceChart = () => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const candleSeriesRef = useRef<any>(null);

  // Upbit API에서 가져온 데이터를 lightweight-charts 포맷으로 변환하고 시간순으로 정렬하는 함수
  const transformCandleData = (data: any) => {
    return data
      .map((candle: any) => ({
        time: Math.floor(candle.timestamp / 1000), // lightweight-charts는 초 단위의 Unix 타임스탬프를 사용
        open: candle.opening_price,
        high: candle.high_price,
        low: candle.low_price,
        close: candle.trade_price,
      }))
      .sort((a: any, b: any) => a.time - b.time); // 시간순으로 오름차순 정렬
  };

  const fetchCandleData = async () => {
    try {
      const response = await fetch("https://api.upbit.com/v1/candles/minutes/60?market=KRW-BTC&count=150");
      const data = await response.json();
      return transformCandleData(data); // 데이터를 변환한 후 반환
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

    // 차트 크기 조정 시 크기도 동적으로 변경
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener("resize", handleResize);

    // 캔들 데이터를 가져와 차트에 반영
    fetchCandleData().then((candles) => {
      if (candleSeriesRef.current) {
        candleSeriesRef.current.setData(candles);
      }
    });

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, []);

  return <div ref={chartContainerRef} />;
};

export default UpbitPriceChart;
