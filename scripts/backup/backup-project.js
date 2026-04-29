/**
 * backup-project.js
 * Crea backups comprimidos del proyecto usando solo Node.js.
 * Corre con: node scripts/backup/backup-project.js
 */

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const { pipeline } = require("stream");
const { promisify } = require("util");

const pipelineAsync = promisify(pipeline);

const PROJECT_DIR = path.join(__dirname, "..", "..");
const BACKUP_DIR = path.join(PROJECT_DIR, "backups");

// Extensiones a incluir
const INCLUDE = [".ts", ".tsx", ".js", ".css", ".json", ".md", ".env", ".txt"];
const EXCLUDE_DIRS = ["node_modules", ".next", "dist", "backups", "logs", ".git"];

async function createBackup() {
  console.log("💾 Starting backup...\n");

  // Crear directorio de backups
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupName = `nexus-backup-${timestamp}.tar.gz`;
  const backupPath = path.join(BACKUP_DIR, backupName);

  // Crear lista de archivos
  const files = [];
  function collectFiles(dir, baseDir = "") {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const relativePath = path.join(baseDir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        if (EXCLUDE_DIRS.includes(item)) continue;
        collectFiles(fullPath, relativePath);
      } else if (INCLUDE.some((ext) => item.endsWith(ext))) {
        files.push({ fullPath, relativePath, size: stat.size });
      }
    }
  }

  collectFiles(PROJECT_DIR);

  console.log(`📁 Files to backup: ${files.length}`);
  const totalSize = files.reduce((sum, f) => sum + f.size, 0);
  console.log(`📊 Total size: ${(totalSize / 1024).toFixed(2)} KB\n`);

  // Crear archivo tar.gz manualmente (simplificado)
  // En producción usarías tar-stream, pero aquí usamos un JSON comprimido
  const manifest = {
    createdAt: new Date().toISOString(),
    nodeVersion: process.version,
    platform: process.platform,
    totalFiles: files.length,
    totalSize,
    files: files.map((f) => ({
      path: f.relativePath,
      size: f.size,
      content: fs.readFileSync(f.fullPath, "utf-8"),
    })),
  };

  const jsonData = JSON.stringify(manifest, null, 2);
  const compressed = zlib.gzipSync(jsonData, { level: 9 });
  fs.writeFileSync(backupPath, compressed);

  const compressedSize = fs.statSync(backupPath).size;
  const ratio = ((1 - compressedSize / totalSize) * 100).toFixed(1);

  console.log("✅ Backup completed!");
  console.log(`📦 File: ${backupName}`);
  console.log(`📍 Path: ${backupPath}`);
  console.log(`📊 Original: ${(totalSize / 1024).toFixed(2)} KB`);
  console.log(`📊 Compressed: ${(compressedSize / 1024).toFixed(2)} KB`);
  console.log(`📉 Compression ratio: ${ratio}%`);

  // Listar backups existentes
  const backups = fs.readdirSync(BACKUP_DIR)
    .filter((f) => f.endsWith(".tar.gz"))
    .map((f) => ({
      name: f,
      size: fs.statSync(path.join(BACKUP_DIR, f)).size,
      created: fs.statSync(path.join(BACKUP_DIR, f)).mtime,
    }))
    .sort((a, b) => b.created - a.created);

  console.log(`\n📋 Total backups: ${backups.length}`);

  // Mantener solo los últimos 10 backups
  if (backups.length > 10) {
    const toDelete = backups.slice(10);
    console.log(`🗑️  Cleaning old backups: ${toDelete.length}`);
    for (const backup of toDelete) {
      fs.unlinkSync(path.join(BACKUP_DIR, backup.name));
      console.log(`   🗑️  ${backup.name}`);
    }
  }
}

createBackup().catch((err) => {
  console.error("❌ Backup failed:", err);
  process.exit(1);
});
