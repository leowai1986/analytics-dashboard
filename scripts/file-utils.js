/**
 * file-utils.js
 * Utilidades de filesystem usando APIs nativas de Node.js.
 * Corre con: node scripts/file-utils.js
 */

const fs = require("fs");
const path = require("path");

/**
 * Cuenta líneas de código en el proyecto (excluyendo node_modules)
 */
function countLinesOfCode(dir, extensions = [".ts", ".tsx", ".js", ".css"]) {
  let totalLines = 0;
  let fileCount = 0;

  function walk(currentDir) {
    const items = fs.readdirSync(currentDir);
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        if (item === "node_modules" || item === ".next" || item === "dist") continue;
        walk(fullPath);
      } else if (extensions.some((ext) => item.endsWith(ext))) {
        const content = fs.readFileSync(fullPath, "utf-8");
        const lines = content.split("\n").length;
        totalLines += lines;
        fileCount++;
      }
    }
  }

  walk(dir);
  return { totalLines, fileCount };
}

/**
 * Lista la estructura de directorios como árbol
 */
function tree(dir, prefix = "", isLast = true) {
  const items = fs.readdirSync(dir).filter((i) => i !== "node_modules" && i !== ".next" && i !== "dist");
  let output = "";

  items.forEach((item, index) => {
    const isLastItem = index === items.length - 1;
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    const connector = isLastItem ? "└── " : "├── ";
    const newPrefix = prefix + (isLastItem ? "    " : "│   ");

    output += `${prefix}${connector}${item}${stat.isDirectory() ? "/" : ""}\n`;

    if (stat.isDirectory()) {
      output += tree(fullPath, newPrefix, isLastItem);
    }
  });

  return output;
}

/**
 * Encuentra archivos duplicados por contenido
 */
function findDuplicates(dir) {
  const hashes = new Map();
  const duplicates = [];

  function walk(currentDir) {
    const items = fs.readdirSync(currentDir);
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        if (item === "node_modules" || item === ".next" || item === "dist") continue;
        walk(fullPath);
      } else {
        const content = fs.readFileSync(fullPath);
        const hash = require("crypto").createHash("md5").update(content).digest("hex");

        if (hashes.has(hash)) {
          duplicates.push({ file: fullPath, duplicateOf: hashes.get(hash) });
        } else {
          hashes.set(hash, fullPath);
        }
      }
    }
  }

  walk(dir);
  return duplicates;
}

// --- Ejecución ---
const projectDir = path.join(__dirname, "..");

console.log("═══════════════════════════════════════");
console.log("📊 PROJECT STATISTICS (Node.js)");
console.log("═══════════════════════════════════════\n");

// Stats de líneas de código
const stats = countLinesOfCode(projectDir);
console.log(`📝 Total Lines of Code: ${stats.totalLines.toLocaleString()}`);
console.log(`📄 Total Files: ${stats.fileCount}\n`);

// Tree del proyecto
console.log("📁 Project Tree:");
console.log(tree(projectDir));

// Duplicados
const dups = findDuplicates(projectDir);
if (dups.length > 0) {
  console.log("⚠️  Duplicate files found:");
  dups.forEach((d) => console.log(`   ${d.file} → ${d.duplicateOf}`));
} else {
  console.log("✅ No duplicate files found");
}

console.log("\n═══════════════════════════════════════");
console.log(`🖥️  Node.js: ${process.version}`);
console.log(`⏱️  Executed: ${new Date().toLocaleString()}`);
console.log("═══════════════════════════════════════");
