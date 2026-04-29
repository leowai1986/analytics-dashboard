/**
 * check-env.js
 * Verifica que el entorno de Node.js esté correctamente configurado.
 * Corre con: node scripts/check-env.js
 */

const fs = require("fs");
const path = require("path");
const os = require("os");

console.log("═══════════════════════════════════════");
console.log("🔍 ENVIRONMENT CHECK (Node.js)");
console.log("═══════════════════════════════════════\n");

// Info del sistema
console.log("💻 System Info:");
console.log(`   Platform: ${os.platform()} ${os.release()}`);
console.log(`   Architecture: ${os.arch()}`);
console.log(`   CPUs: ${os.cpus().length} cores`);
console.log(`   Total Memory: ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`);
console.log(`   Free Memory: ${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB\n`);

// Info de Node.js
console.log("🟢 Node.js Info:");
console.log(`   Version: ${process.version}`);
console.log(`   Executable: ${process.execPath}`);
console.log(`   PID: ${process.pid}`);
console.log(`   Uptime: ${process.uptime().toFixed(2)}s\n`);

// Verificar archivos requeridos
console.log("📁 Required Files Check:");
const requiredFiles = [
  "package.json",
  "next.config.ts",
  "tsconfig.json",
  "postcss.config.mjs",
  ".env",
  "app/globals.css",
  "app/layout.tsx",
];

let allOk = true;
for (const file of requiredFiles) {
  const fullPath = path.join(__dirname, "..", file);
  const exists = fs.existsSync(fullPath);
  const symbol = exists ? "✅" : "❌";
  console.log(`   ${symbol} ${file}`);
  if (!exists) allOk = false;
}

// Verificar node_modules
console.log("\n📦 Dependencies Check:");
const nodeModulesPath = path.join(__dirname, "..", "node_modules");
if (fs.existsSync(nodeModulesPath)) {
  const packages = fs.readdirSync(nodeModulesPath).filter((p) => !p.startsWith("."));
  console.log(`   ✅ node_modules exists (${packages.length} packages)`);

  // Verificar paquetes clave
  const keyPackages = ["next", "react", "react-dom", "tailwindcss", "typescript"];
  for (const pkg of keyPackages) {
    const pkgPath = path.join(nodeModulesPath, pkg);
    const exists = fs.existsSync(pkgPath);
    const symbol = exists ? "✅" : "❌";
    console.log(`   ${symbol} ${pkg}`);
    if (!exists) allOk = false;
  }
} else {
  console.log("   ❌ node_modules not found (run: npm install)");
  allOk = false;
}

// Puerto disponible
console.log("\n🔌 Port Check:");
const net = require("net");
const testPort = (port) => {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", () => resolve(false));
    server.once("listening", () => {
      server.close();
      resolve(true);
    });
    server.listen(port);
  });
};

(async () => {
  const port3000 = await testPort(3000);
  const port3001 = await testPort(3001);
  console.log(`   ${port3000 ? "✅" : "❌"} Port 3000 (Next.js dev)`);
  console.log(`   ${port3001 ? "✅" : "❌"} Port 3001 (API server)`);

  console.log("\n═══════════════════════════════════════");
  if (allOk) {
    console.log("🎉 ALL CHECKS PASSED! Ready to develop.");
  } else {
    console.log("⚠️  SOME CHECKS FAILED. Review above.");
  }
  console.log("═══════════════════════════════════════");
})();
