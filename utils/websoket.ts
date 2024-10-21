let websocket: WebSocket | null = null;

export const getWebSocket = () => {
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
