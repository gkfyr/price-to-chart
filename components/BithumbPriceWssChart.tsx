"use client";

import { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";
import { getBithumbWebSocket, getUpbitWebSocket } from "@/utils/websoket";

const BithumbPriceWssChart = () => {
  const [price, setPrice] = useState<string | null>(null); // 실시간 가격을 저장할 상태
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const candleSeriesRef = useRef<any>(null);

  // Upbit 60분봉 데이터를 불러오는 함수
  const fetchCandleData = async () => {
    try {
      const response = await fetch("/api/bithumb-candles", { cache: "no-store" });
      const data = await response.json();
      console.log(data);
      // 데이터 시간순으로 오름차순 정렬
      const candles = data
        .map((candle: any) => ({
          time: Math.floor((new Date(candle.candle_date_time_kst).getTime() + 32400000) / 1000),
          open: candle.opening_price,
          high: candle.high_price,
          low: candle.low_price,
          close: candle.trade_price,
        }))
        .reverse(); // 시간순 정렬

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
    const socket = getBithumbWebSocket();

    socket.onopen = () => {
      console.log("Connected to Bithumb WebSocket");
      // 서버로 메시지 전송
      const message = JSON.stringify([{ ticket: "test example" }, { type: "ticker", codes: ["KRW-BTC"] }]);
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
      setPrice(data.trade_price);

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

  return (
    <>
      <div className="w-full justify-between flex ">
        <h1 className="font-bold">BTC 가격 차트 (Bithumb) (1d)</h1>
        <div>
          <h1>
            <span className="font-bold">BTC/KRW 실시간 가격:</span>{" "}
            <span className="font-bold">{price ? `₩${parseFloat(price)}` : "Loading..."}</span>
          </h1>
        </div>
      </div>

      <div ref={chartContainerRef} />
    </>
  );
};

export default BithumbPriceWssChart;
