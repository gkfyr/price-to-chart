"use client";

import { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";

const UpbitPriceWssChart = () => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const candleSeriesRef = useRef<any>(null);

  // Upbit 60분봉 데이터를 불러오는 함수
  const fetchCandleData = async () => {
    try {
      const response = await fetch("https://api.upbit.com/v1/candles/days?market=KRW-BTC&count=150");
      const data = await response.json();
      console.log(data);
      // 데이터 시간순으로 오름차순 정렬
      const candles = data
        .map((candle: any) => ({
          time: Math.floor(new Date(candle.candle_date_time_kst).getTime() / 1000),
          open: candle.opening_price,
          high: candle.high_price,
          low: candle.low_price,
          close: candle.trade_price,
        }))
        .sort((a: any, b: any) => a.time - b.time); // 시간순 정렬

      return candles;
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
        secondsVisible: false,
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

    fetchCandleData().then((candles) => {
      if (candleSeriesRef.current) {
        candleSeriesRef.current.setData(candles);
      }
    });
    // WebSocket 연결 설정
    const socket = new WebSocket("wss://api.upbit.com/websocket/v1");

    socket.onopen = () => {
      console.log("Connected to Upbit WebSocket");
      // 서버로 메시지 전송
      const message = JSON.stringify([
        { ticket: "test" },
        { type: "ticker", codes: ["KRW-BTC"], is_only_realtime: true },
      ]);
      socket.send(message);
    };

    // 서버에서 메시지를 수신할 때 처리
    socket.onmessage = (event) => {
      if (event.data instanceof Blob) {
        handleBlobData(event.data);
      }
    };

    // WebSocket 메시지를 처리하는 함수
    const handleBlobData = async (blob: Blob) => {
      const text = await blob.text(); // Blob 데이터를 텍스트로 변환
      const data = JSON.parse(text); // 텍스트를 JSON으로 파싱
      console.log("Received data:", data);

      //   console.log(data.opening_price);
      //   기존 캔들 업데이트
      const timestamp = Math.floor(data.timestamp / 1000); // Unix 초 단위
      const currentHour = Math.floor(timestamp / 3600) * 3600; // 60분 단위로 시간 맞추기
      const currentDay = Math.floor(timestamp / 86400) * 86400; // 1일(24시간) 단위로 시간 맞추기

      // 새로운 60분 캔들이 필요하면 새로운 캔들 생성
      const updatedCandle = {
        time: currentDay, // 60분 단위로 맞춘 시간
        open: data.opening_price, // 시가
        high: data.high_price, // 고가
        low: data.low_price, // 저가
        close: data.trade_price, // 종가 (현재가)
      };

      candleSeriesRef.current.update(updatedCandle);
    };

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      socket.close();
      chart.remove();
    };
  }, []);

  return <div ref={chartContainerRef} />;
};

export default UpbitPriceWssChart;
