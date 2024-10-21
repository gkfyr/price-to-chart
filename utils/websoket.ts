let websocket: WebSocket | null = null;

export const getUpbitWebSocket = () => {
  if (!websocket || websocket.readyState !== WebSocket.OPEN) {
    websocket = new WebSocket("wss://api.upbit.com/websocket/v1");

    websocket.onopen = () => {
      console.log("WebSocket connection established");
    };

    websocket.onerror = (error) => {
      console.error("WebSocket error", error);
    };

    websocket.onclose = () => {
      console.log("WebSocket connection closed");
    };
  }
  return websocket;
};

export const getBithumbWebSocket = () => {
  if (!websocket || websocket.readyState !== WebSocket.OPEN) {
    websocket = new WebSocket("wss://ws-api.bithumb.com/websocket/v1");

    websocket.onopen = () => {
      console.log("WebSocket connection established");
    };

    websocket.onerror = (error) => {
      console.error("WebSocket error", error);
    };

    websocket.onclose = () => {
      console.log("WebSocket connection closed");
    };
  }
  return websocket;
};
