"use client";

import { useEffect, useRef, useState } from "react";

const RealTimePriceUpbit = () => {
  const [price, setPrice] = useState<string | null>(null); // 실시간 가격을 저장할 상태
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // WebSocket 연결 설정
    const ws = new WebSocket("wss://api.upbit.com/websocket/v1");

    // 연결이 열리면 메시지 전송
    ws.onopen = () => {
      console.log("Connected to Upbit WebSocket");

      // 서버로 메시지 전송
      const message = JSON.stringify([{ ticket: "test" }, { type: "ticker", codes: ["KRW-BTC"] }]);
      ws.send(message);
    };

    // Blob 데이터를 처리하는 함수
    const handleBlobData = async (blob: Blob) => {
      const text = await blob.text(); // Blob 데이터를 텍스트로 변환
      const data = JSON.parse(text); // 텍스트를 JSON으로 파싱

      setPrice(data.trade_price);
    };

    // 서버에서 메시지를 수신할 때 처리
    ws.onmessage = (event) => {
      if (event.data instanceof Blob) {
        // Blob이면 변환해서 처리
        handleBlobData(event.data);
      } else {
        // Blob이 아니면 바로 JSON으로 처리
        const data = JSON.parse(event.data);

        setPrice(data.trade_price);
      }
    };

    // 에러 처리
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // 연결이 닫힐 때 처리
    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // 컴포넌트 언마운트 시 WebSocket 연결 종료
    wsRef.current = ws;
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return (
    <div>
      <h1>
        <span className="font-bold">BTC/KRW 실시간 가격:</span>{" "}
        <span className="font-bold">{price ? `₩${parseFloat(price)}` : "Loading..."}</span>
      </h1>
    </div>
  );
};

export default RealTimePriceUpbit;
