/**
 * fs-helpers.js
 * Utilidades de filesystem reutilizables para Node.js.
 */

const fs = require("fs");
const path = require("path");

/**
 * Lee un directorio recursivamente y retorna todos los archivos
 */
function readDirRecursive(dir, options = {}) {
  const {
    includeDirs = false,
    exclude = ["node_modules", ".git", ".next", "dist"],
    extensions = null,
  } = options;

  const results = [];

  function walk(currentDir, basePath = "") {
    const items = fs.readdirSync(currentDir);

    for (const item of items) {
      if (exclude.includes(item)) continue;

      const fullPath = path.join(currentDir, item);
      const relativePath = path.join(basePath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        if (includeDirs) {
          results.push({
            path: relativePath,
            fullPath,
            type: "directory",
            size: 0,
          });
        }
        walk(fullPath, relativePath);
      } else {
        if (extensions && !extensions.some((ext) => item.endsWith(ext))) {
          continue;
        }
        results.push({
          path: relativePath,
          fullPath,
          type: "file",
          size: stat.size,
          modified: stat.mtime,
        });
      }
    }
  }

  walk(dir);
  return results;
}

/**
 * Asegura que un directorio exista
 */
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

/**
 * Escribe JSON formateado
 */
function writeJson(filePath, data) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

/**
 * Lee JSON con manejo de errores
 */
function readJson(filePath, defaultValue = null) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return defaultValue;
  }
}

/**
 * Copia recursiva
 */
function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    ensureDir(dest);
    const items = fs.readdirSync(src);
    for (const item of items) {
      copyRecursive(path.join(src, item), path.join(dest, item));
    }
  } else {
    ensureDir(path.dirname(dest));
    fs.copyFileSync(src, dest);
  }
}

/**
 * Elimina recursivamente
 */
function removeRecursive(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

/**
 * Observa cambios en archivos
 */
function watchFiles(pattern, callback) {
  const chokidar = require("chokidar");
  const watcher = chokidar.watch(pattern, {
    ignored: /node_modules/,
    persistent: true,
  });

  watcher.on("change", callback);
  return watcher;
}

module.exports = {
  readDirRecursive,
  ensureDir,
  writeJson,
  readJson,
  copyRecursive,
  removeRecursive,
  watchFiles,
};

// Demo
if (require.main === module) {
  const projectDir = path.join(__dirname, "..", "..");
  const files = readDirRecursive(projectDir, {
    extensions: [".ts", ".tsx", ".js"],
  });

  console.log("📁 Project Files:");
  console.log(`   Total: ${files.length} files`);
  console.log(`   Size: ${(files.reduce((s, f) => s + f.size, 0) / 1024).toFixed(2)} KB`);
}
