/**
 * simple-api.js
 * API REST simple usando solo el módulo http nativo de Node.js.
 * Corre con: node server/simple-api.js
 * Prueba con: curl http://localhost:3001/api/metrics
 */

const http = require("http");
const url = require("url");

// Datos mock en memoria
const metrics = {
  totalRevenue: 45231.89,
  activeUsers: 2350,
  bounceRate: 42.3,
  avgSession: "4m 32s",
  lastUpdated: new Date().toISOString(),
};

const customers = [
  { id: "1", name: "Alice Morgan", email: "alice@example.com", plan: "Enterprise" },
  { id: "2", name: "Bob Chen", email: "bob@example.com", plan: "Pro" },
  { id: "3", name: "Carla Diaz", email: "carla@example.com", plan: "Starter" },
];

// Router simple
const routes = {
  "/api/health": (req, res) => {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", timestamp: new Date().toISOString() }));
  },

  "/api/metrics": (req, res) => {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(metrics));
  },

  "/api/customers": (req, res) => {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ count: customers.length, data: customers }));
  },

  "/api/customers/1": (req, res) => {
    const customer = customers.find((c) => c.id === "1");
    if (customer) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(customer));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Customer not found" }));
    }
  },
};

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const handler = routes[parsedUrl.pathname];

  if (handler) {
    handler(req, res);
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found", path: parsedUrl.pathname }));
  }
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log("🚀 Simple API server running on Node.js");
  console.log(`📡 http://localhost:${PORT}`);
  console.log("
📋 Available endpoints:");
  console.log(`   GET http://localhost:${PORT}/api/health`);
  console.log(`   GET http://localhost:${PORT}/api/metrics`);
  console.log(`   GET http://localhost:${PORT}/api/customers`);
  console.log(`   GET http://localhost:${PORT}/api/customers/1`);
});
