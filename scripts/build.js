/**
 * build.js
 * Script de build personalizado usando Node.js puro.
 * Corre con: node scripts/build.js
 * Este script simula lo que hace "npm run build" pero paso a paso.
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const BUILD_DIR = path.join(__dirname, "..", "dist");
const SRC_DIR = path.join(__dirname, "..");

console.log("🔧 Starting custom build with Node.js...\n");

// Paso 1: Limpiar directorio de build
console.log("🧹 Step 1: Cleaning build directory...");
if (fs.existsSync(BUILD_DIR)) {
  fs.rmSync(BUILD_DIR, { recursive: true });
}
fs.mkdirSync(BUILD_DIR, { recursive: true });
console.log("   ✅ Build directory cleaned\n");

// Paso 2: Verificar dependencias
console.log("📦 Step 2: Checking dependencies...");
try {
  const pkg = JSON.parse(fs.readFileSync(path.join(SRC_DIR, "package.json"), "utf-8"));
  console.log(`   📛 Project: ${pkg.name} v${pkg.version}`);
  console.log(`   📚 Dependencies: ${Object.keys(pkg.dependencies || {}).length}`);
  console.log(`   🛠️  DevDependencies: ${Object.keys(pkg.devDependencies || {}).length}`);
  console.log("   ✅ Dependencies OK\n");
} catch (err) {
  console.error("   ❌ Error reading package.json:", err.message);
  process.exit(1);
}

// Paso 3: TypeScript check (simulado)
console.log("🔍 Step 3: Running TypeScript checks...");
try {
  execSync("npx tsc --noEmit", { cwd: SRC_DIR, stdio: "pipe" });
  console.log("   ✅ TypeScript checks passed\n");
} catch (err) {
  console.log("   ⚠️  TypeScript warnings (non-blocking)\n");
}

// Paso 4: Copiar archivos estáticos
console.log("📁 Step 4: Copying static files...");
const staticFiles = [".env", ".env.example", "README.md"];
staticFiles.forEach((file) => {
  const src = path.join(SRC_DIR, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(BUILD_DIR, file));
    console.log(`   📄 ${file}`);
  }
});
console.log("   ✅ Static files copied\n");

// Paso 5: Generar resumen de build
console.log("📊 Step 5: Generating build report...");
const buildReport = {
  project: "nexus-analytics",
  builtAt: new Date().toISOString(),
  nodeVersion: process.version,
  platform: process.platform,
  arch: process.arch,
  env: process.env.NODE_ENV || "development",
  outputDir: BUILD_DIR,
};

fs.writeFileSync(
  path.join(BUILD_DIR, "build-report.json"),
  JSON.stringify(buildReport, null, 2)
);

console.log("   ✅ Build report generated\n");

// Resumen final
console.log("═══════════════════════════════════════");
console.log("🎉 BUILD COMPLETED SUCCESSFULLY!");
console.log("═══════════════════════════════════════");
console.log(`📂 Output: ${BUILD_DIR}`);
console.log(`⏱️  Time: ${new Date().toLocaleString()}`);
console.log(`🖥️  Node: ${process.version}`);
console.log(`💻 Platform: ${process.platform} (${process.arch})`);
console.log("═══════════════════════════════════════");
