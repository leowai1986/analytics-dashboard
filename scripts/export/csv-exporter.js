/**
 * csv-exporter.js
 * Exporta datos mock a CSV usando solo Node.js.
 * Corre con: node scripts/export/csv-exporter.js
 */

const fs = require("fs");
const path = require("path");

const OUTPUT_DIR = path.join(__dirname, "..", "..", "exports");

function escapeCsv(value) {
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCsv(headers, rows) {
  const lines = [headers.map(escapeCsv).join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => escapeCsv(row[h])).join(","));
  }
  return lines.join("\n");
}

// Datos de ejemplo
const customers = [
  { id: "1", name: "Alice Morgan", email: "alice@example.com", plan: "Enterprise", revenue: 5000, region: "North America" },
  { id: "2", name: "Bob Chen", email: "bob@example.com", plan: "Pro", revenue: 1200, region: "Asia Pacific" },
  { id: "3", name: "Carla Diaz", email: "carla@example.com", plan: "Starter", revenue: 300, region: "Europe" },
  { id: "4", name: "Daniel Kim", email: "daniel@example.com", plan: "Enterprise", revenue: 4500, region: "North America" },
  { id: "5", name: "Eva Patel", email: "eva@example.com", plan: "Pro", revenue: 1800, region: "Middle East" },
];

const metrics = [
  { month: "Jan", revenue: 4000, expenses: 2400, profit: 1600 },
  { month: "Feb", revenue: 3000, expenses: 1398, profit: 1602 },
  { month: "Mar", revenue: 2000, expenses: 9800, profit: -7800 },
  { month: "Apr", revenue: 2780, expenses: 3908, profit: -1128 },
  { month: "May", revenue: 1890, expenses: 4800, profit: -2910 },
];

// Crear directorio
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Exportar customers
const customersCsv = toCsv(
  ["id", "name", "email", "plan", "revenue", "region"],
  customers
);
fs.writeFileSync(path.join(OUTPUT_DIR, "customers.csv"), customersCsv);

// Exportar metrics
const metricsCsv = toCsv(
  ["month", "revenue", "expenses", "profit"],
  metrics
);
fs.writeFileSync(path.join(OUTPUT_DIR, "metrics.csv"), metricsCsv);

// Exportar resumen
const summary = {
  totalCustomers: customers.length,
  totalRevenue: customers.reduce((sum, c) => sum + c.revenue, 0),
  avgRevenue: customers.reduce((sum, c) => sum + c.revenue, 0) / customers.length,
  byPlan: customers.reduce((acc, c) => {
    acc[c.plan] = (acc[c.plan] || 0) + 1;
    return acc;
  }, {}),
};

fs.writeFileSync(
  path.join(OUTPUT_DIR, "summary.json"),
  JSON.stringify(summary, null, 2)
);

console.log("📊 CSV Export Complete!");
console.log(`📁 Output: ${OUTPUT_DIR}`);
console.log(`📄 customers.csv (${customers.length} rows)`);
console.log(`📄 metrics.csv (${metrics.length} rows)`);
console.log(`📄 summary.json`);
console.log(`\n💰 Total Revenue: $${summary.totalRevenue.toLocaleString()}`);
console.log(`📈 Avg Revenue: $${summary.avgRevenue.toFixed(2)}`);
console.log(`📋 By Plan:`, summary.byPlan);
