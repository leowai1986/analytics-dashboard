/**
 * custom-logger.js
 * Sistema de logging con niveles, rotación de archivos y colores.
 * Puro Node.js, sin dependencias externas.
 */

const fs = require("fs");
const path = require("path");
const { format } = require("util");

const LOG_DIR = path.join(__dirname, "..", "..", "logs");
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 5;

// Crear directorio de logs
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

const LEVELS = {
  DEBUG: { value: 0, color: "\x1b[36m", label: "DEBUG" },   // Cyan
  INFO:  { value: 1, color: "\x1b[32m", label: "INFO"  },   // Green
  WARN:  { value: 2, color: "\x1b[33m", label: "WARN"  },   // Yellow
  ERROR: { value: 3, color: "\x1b[31m", label: "ERROR" },   // Red
  FATAL: { value: 4, color: "\x1b[35m", label: "FATAL" },   // Magenta
};

const RESET = "\x1b[0m";

class Logger {
  constructor(name = "app", level = "DEBUG") {
    this.name = name;
    this.level = LEVELS[level] ? LEVELS[level].value : 1;
    this.logFile = path.join(LOG_DIR, `${name}.log`);
  }

  _getTimestamp() {
    return new Date().toISOString();
  }

  _shouldLog(levelValue) {
    return levelValue >= this.level;
  }

  _rotateIfNeeded() {
    try {
      const stats = fs.statSync(this.logFile);
      if (stats.size > MAX_FILE_SIZE) {
        // Rotar archivos
        for (let i = MAX_FILES - 1; i >= 1; i--) {
          const oldFile = `${this.logFile}.${i}`;
          const newFile = `${this.logFile}.${i + 1}`;
          if (fs.existsSync(oldFile)) {
            fs.renameSync(oldFile, newFile);
          }
        }
        fs.renameSync(this.logFile, `${this.logFile}.1`);
      }
    } catch (err) {
      // Archivo no existe aún, no hay problema
    }
  }

  _write(level, message, ...args) {
    if (!this._shouldLog(level.value)) return;

    const timestamp = this._getTimestamp();
    const formattedMessage = args.length > 0 ? format(message, ...args) : message;
    const logLine = `[${timestamp}] [${level.label}] [${this.name}] ${formattedMessage}\n`;

    // Console con colores
    console.log(`${level.color}${logLine.trim()}${RESET}`);

    // Archivo sin colores
    this._rotateIfNeeded();
    fs.appendFileSync(this.logFile, logLine.replace(/\x1b\[\d+m/g, ""));
  }

  debug(message, ...args) { this._write(LEVELS.DEBUG, message, ...args); }
  info(message, ...args)  { this._write(LEVELS.INFO,  message, ...args); }
  warn(message, ...args)  { this._write(LEVELS.WARN,  message, ...args); }
  error(message, ...args) { this._write(LEVELS.ERROR, message, ...args); }
  fatal(message, ...args)  { this._write(LEVELS.FATAL, message, ...args); }

  // Métricas de performance
  time(label) {
    console.time(`${this.name}:${label}`);
  }

  timeEnd(label) {
    console.timeEnd(`${this.name}:${label}`);
  }
}

// Logger global
const logger = new Logger("nexus", process.env.LOG_LEVEL || "DEBUG");

module.exports = { Logger, logger, LEVELS };

// Si se ejecuta directamente
if (require.main === module) {
  console.log("📝 Logger Demo\n");

  const log = new Logger("demo", "DEBUG");

  log.debug("Debug message: %s", "variable");
  log.info("Application started on port %d", 3000);
  log.warn("High memory usage: %d%%", 85);
  log.error("Failed to connect to database: %s", "ECONNREFUSED");
  log.fatal("Critical system failure");

  log.time("operation");
  // Simular operación
  for (let i = 0; i < 1000000; i++) {}
  log.timeEnd("operation");

  console.log(`\n📁 Logs saved to: ${LOG_DIR}`);
}
