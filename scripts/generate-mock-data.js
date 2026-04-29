/**
 * generate-mock-data.js
 * Script de Node.js puro para generar datos mock aleatorios.
 * Corre con: node scripts/generate-mock-data.js
 */

const fs = require("fs");
const path = require("path");

// --- Helpers ---
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min, max, decimals = 1) => {
  const val = Math.random() * (max - min) + min;
  return parseFloat(val.toFixed(decimals));
};
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const firstNames = ["Alice", "Bob", "Carla", "Daniel", "Eva", "Frank", "Grace", "Henry", "Ivy", "Jack", "Karen", "Leo"];
const lastNames = ["Morgan", "Chen", "Diaz", "Kim", "Patel", "Smith", "Johnson", "Brown", "Wilson", "Lee"];
const regions = ["North America", "Europe", "Asia Pacific", "Latin America", "Middle East"];
const plans = ["Starter", "Pro", "Enterprise"];
const statuses = ["Active", "Trial", "Churned"];
const actions = [
  "Published new campaign",
  "Updated user permissions",
  "Server maintenance scheduled",
  "Payment gateway integration",
  "Analytics report generated",
  "New feature deployed",
  "Database backup completed",
  "Security audit passed",
];
const users = ["Sarah Chen", "Marcus Johnson", "System", "Elena Rodriguez", "David Kim", "Admin"];

// --- Generators ---
function generateRevenueData() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months.map((name) => ({
    name,
    value: randomInt(1500, 7000),
    secondary: randomInt(1000, 8000),
  }));
}

function generateWeeklyVisitors() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((name) => ({
    name,
    value: randomInt(800, 3000),
  }));
}

function generateCustomers(count = 20) {
  return Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
    name: `${pick(firstNames)} ${pick(lastNames)}`,
    email: `${pick(firstNames).toLowerCase()}.${pick(lastNames).toLowerCase()}@example.com`,
    plan: pick(plans),
    status: pick(statuses),
    region: pick(regions),
    revenue: randomFloat(100, 5000),
    joined: `${randomInt(1, 30)} days ago`,
  }));
}

function generateActivity(count = 10) {
  return Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
    action: pick(actions),
    user: pick(users),
    timestamp: `${randomInt(1, 59)} minutes ago`,
    status: pick(["completed", "pending", "failed"]),
  }));
}

function generateRegionData() {
  return regions.map((region) => ({
    region,
    users: randomInt(1000, 15000),
    sessions: randomInt(5000, 40000),
    bounceRate: randomFloat(30, 60),
  }));
}

// --- Main ---
const output = {
  revenueData: generateRevenueData(),
  weeklyVisitors: generateWeeklyVisitors(),
  customers: generateCustomers(),
  activity: generateActivity(),
  regionBreakdown: generateRegionData(),
  generatedAt: new Date().toISOString(),
};

const outputPath = path.join(__dirname, "..", "data", "generated-mock.json");
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

console.log("✅ Mock data generated successfully!");
console.log(`📁 Saved to: ${outputPath}`);
console.log(`📊 Generated:`);
console.log(`   - ${output.revenueData.length} revenue records`);
console.log(`   - ${output.weeklyVisitors.length} visitor records`);
console.log(`   - ${output.customers.length} customers`);
console.log(`   - ${output.activity.length} activity items`);
console.log(`   - ${output.regionBreakdown.length} regions`);
