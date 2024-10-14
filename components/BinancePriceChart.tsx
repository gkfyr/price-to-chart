"use client";

import { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

const EthCandleChart = () => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const candleSeriesRef = useRef<any>(null);

  const fetchCandleData = async () => {
    try {
      const response = await fetch("/api/getCandleData");
      const data = await response.json();
      return data.candles;
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

export default EthCandleChart;
