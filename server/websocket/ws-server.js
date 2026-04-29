/**
 * ws-server.js
 * Servidor WebSocket usando el módulo 'ws' de Node.js.
 * Corre con: node server/websocket/ws-server.js
 * Prueba con: node server/websocket/ws-client.js
 */

const WebSocket = require("ws");
const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("WebSocket Server Running\n");
});

const wss = new WebSocket.Server({ server });

const clients = new Map();
let messageId = 0;

wss.on("connection", (ws, req) => {
  const clientId = `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  clients.set(ws, { id: clientId, connectedAt: new Date() });

  console.log(`🔌 Client connected: ${clientId}`);

  // Enviar mensaje de bienvenida
  ws.send(JSON.stringify({
    type: "welcome",
    clientId,
    timestamp: new Date().toISOString(),
    message: "Connected to Nexus Analytics WebSocket",
  }));

  // Notificar a otros clientes
  broadcast({
    type: "user_joined",
    clientId,
    totalClients: clients.size,
  }, ws);

  ws.on("message", (data) => {
    try {
      const parsed = JSON.parse(data);
      messageId++;

      console.log(`📨 Message #${messageId} from ${clientId}:`, parsed.type);

      // Echo + broadcast
      const response = {
        type: "echo",
        id: messageId,
        clientId,
        original: parsed,
        timestamp: new Date().toISOString(),
      };

      ws.send(JSON.stringify(response));

      // Si es un evento de analytics, broadcast a todos
      if (parsed.type === "analytics_event") {
        broadcast({
          type: "analytics_update",
          id: messageId,
          data: parsed.payload,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (err) {
      ws.send(JSON.stringify({
        type: "error",
        message: "Invalid JSON",
        timestamp: new Date().toISOString(),
      }));
    }
  });

  ws.on("close", () => {
    console.log(`🔌 Client disconnected: ${clientId}`);
    clients.delete(ws);
    broadcast({
      type: "user_left",
      clientId,
      totalClients: clients.size,
    });
  });

  ws.on("error", (err) => {
    console.error(`❌ WebSocket error for ${clientId}:`, err.message);
  });
});

function broadcast(message, excludeWs = null) {
  const data = JSON.stringify(message);
  clients.forEach((info, ws) => {
    if (ws !== excludeWs && ws.readyState === WebSocket.OPEN) {
      ws.send(data);
    }
  });
}

// Enviar heartbeat cada 30 segundos
setInterval(() => {
  broadcast({
    type: "heartbeat",
    timestamp: new Date().toISOString(),
    activeClients: clients.size,
  });
}, 30000);

const PORT = process.env.WS_PORT || 3002;

server.listen(PORT, () => {
  console.log("🚀 WebSocket Server running on Node.js");
  console.log(`📡 ws://localhost:${PORT}`);
  console.log(`👥 Active clients: ${clients.size}`);
});

module.exports = { wss, broadcast, clients };
