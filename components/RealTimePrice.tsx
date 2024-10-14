"use client";

import { useEffect, useState, useRef } from "react";

const RealTimePrice = () => {
  const [price, setPrice] = useState<string | null>(null); // 실시간 가격을 저장할 상태
  const socketRef = useRef<WebSocket | null>(null); // 웹소켓 참조

  useEffect(() => {
    // 바이낸스 웹소켓 연결
    socketRef.current = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");

    // 웹소켓 메시지를 수신할 때마다 실행
    socketRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const latestPrice = message.p; // 실시간 가격 정보 ('p' 필드)
      setPrice(latestPrice); // 가격 업데이트
    };

    // Cleanup: 컴포넌트가 언마운트될 때 웹소켓 연결 해제
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return (
    <div>
      <h1>
        <span className="font-bold">BTC/USDT 실시간 가격:</span>{" "}
        <span>{price ? `$${parseFloat(price).toFixed(2)}` : "Loading..."}</span>
      </h1>
    </div>
  );
};

export default RealTimePrice;
