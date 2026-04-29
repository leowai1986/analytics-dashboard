/**
 * ws-client.js
 * Cliente WebSocket de prueba usando Node.js.
 * Corre con: node server/websocket/ws-client.js
 */

const WebSocket = require("ws");

const WS_URL = process.env.WS_URL || "ws://localhost:3002";

console.log(`🔌 Connecting to ${WS_URL}...`);

const ws = new WebSocket(WS_URL);

ws.on("open", () => {
  console.log("✅ Connected to WebSocket server");

  // Enviar evento de analytics
  ws.send(JSON.stringify({
    type: "analytics_event",
    payload: {
      event: "page_view",
      page: "/dashboard",
      timestamp: new Date().toISOString(),
    },
  }));

  // Enviar ping cada 10 segundos
  setInterval(() => {
    ws.send(JSON.stringify({
      type: "ping",
      timestamp: new Date().toISOString(),
    }));
  }, 10000);
});

ws.on("message", (data) => {
  const msg = JSON.parse(data);
  console.log(`📨 Received: [${msg.type}]`, msg.type === "echo" ? `(id: ${msg.id})` : "");
});

ws.on("close", () => {
  console.log("🔌 Disconnected from server");
  process.exit(0);
});

ws.on("error", (err) => {
  console.error("❌ WebSocket error:", err.message);
});

// Cerrar después de 60 segundos
setTimeout(() => {
  console.log("⏱️  Closing connection...");
  ws.close();
}, 60000);
