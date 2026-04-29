/**
 * deploy-static.js
 * Script de deploy estático con verificación de archivos.
 * Corre con: node scripts/deploy/deploy-static.js
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execSync } = require("child_process");

const DIST_DIR = path.join(__dirname, "..", "..", "dist");
const DEPLOY_CONFIG = {
  target: process.env.DEPLOY_TARGET || "github-pages",
  basePath: process.env.DEPLOY_BASE_PATH || "/nexus-analytics",
  cname: process.env.DEPLOY_CNAME || "",
};

function hashFile(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(content).digest("hex").substring(0, 16);
}

function verifyBuild() {
  console.log("🔍 Verifying build...\n");

  const requiredFiles = ["index.html", "_next/static"];
  const missing = [];

  for (const file of requiredFiles) {
    const fullPath = path.join(DIST_DIR, file);
    if (!fs.existsSync(fullPath)) {
      missing.push(file);
    }
  }

  if (missing.length > 0) {
    console.error("❌ Missing required files:");
    missing.forEach((f) => console.error(`   - ${f}`));
    console.error("\n💡 Run 'npm run build' first");
    process.exit(1);
  }

  // Calcular hashes de archivos críticos
  const indexHtml = path.join(DIST_DIR, "index.html");
  const indexHash = hashFile(indexHtml);
  const indexSize = (fs.statSync(indexHtml).size / 1024).toFixed(2);

  console.log(`✅ Build verified`);
  console.log(`   📄 index.html: ${indexSize} KB (${indexHash})`);

  // Contar archivos totales
  let fileCount = 0;
  let totalSize = 0;

  function countFiles(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        countFiles(fullPath);
      } else {
        fileCount++;
        totalSize += stat.size;
      }
    }
  }

  countFiles(DIST_DIR);
  console.log(`   📦 Total files: ${fileCount}`);
  console.log(`   📊 Total size: ${(totalSize / 1024).toFixed(2)} KB\n`);

  return { fileCount, totalSize };
}

function generateDeployInfo() {
  const info = {
    deployedAt: new Date().toISOString(),
    nodeVersion: process.version,
    platform: process.platform,
    gitCommit: getGitCommit(),
    buildId: crypto.randomUUID(),
    target: DEPLOY_CONFIG.target,
  };

  fs.writeFileSync(
    path.join(DIST_DIR, "deploy-info.json"),
    JSON.stringify(info, null, 2)
  );

  console.log("📝 Deploy info generated");
  console.log(`   🆔 Build ID: ${info.buildId}`);
  console.log(`   📌 Git: ${info.gitCommit || "N/A"}\n`);
}

function getGitCommit() {
  try {
    return execSync("git rev-parse --short HEAD", { encoding: "utf-8" }).trim();
  } catch {
    return null;
  }
}

function createCname() {
  if (DEPLOY_CONFIG.cname) {
    fs.writeFileSync(path.join(DIST_DIR, "CNAME"), DEPLOY_CONFIG.cname);
    console.log(`🌐 CNAME created: ${DEPLOY_CONFIG.cname}\n`);
  }
}

function generateGitHubActionsWorkflow() {
  const workflowDir = path.join(__dirname, "..", "..", ".github", "workflows");
  if (!fs.existsSync(workflowDir)) {
    fs.mkdirSync(workflowDir, { recursive: true });
  }

  const workflow = `name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: \\${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
`;

  fs.writeFileSync(path.join(workflowDir, "deploy.yml"), workflow);
  console.log("🚀 GitHub Actions workflow created");
  console.log(`   📁 .github/workflows/deploy.yml\n`);
}

// --- Main ---
console.log("═══════════════════════════════════════");
console.log("🚀 DEPLOY SCRIPT (Node.js)");
console.log("═══════════════════════════════════════\n");

console.log(`🎯 Target: ${DEPLOY_CONFIG.target}`);
console.log(`📂 Base path: ${DEPLOY_CONFIG.basePath}\n`);

// Verificar build
verifyBuild();

// Generar info de deploy
generateDeployInfo();

// Crear CNAME si aplica
createCname();

// Generar workflow de GitHub Actions
generateGitHubActionsWorkflow();

console.log("═══════════════════════════════════════");
console.log("✅ DEPLOY READY!");
console.log("═══════════════════════════════════════");
console.log("\nNext steps:");
console.log("   1. Commit and push to GitHub");
console.log("   2. GitHub Actions will deploy automatically");
console.log("   3. Or manually upload the 'dist/' folder");
console.log("═══════════════════════════════════════");
