/**
 * environments.js
 * Configuración de entornos usando variables de Node.js.
 */

const path = require("path");

const ENV = process.env.NODE_ENV || "development";

const config = {
  development: {
    name: "development",
    debug: true,
    apiUrl: "http://localhost:3001",
    wsUrl: "ws://localhost:3002",
    logLevel: "debug",
    features: {
      analytics: true,
      notifications: true,
      search: true,
      websocket: true,
    },
    database: {
      host: "localhost",
      port: 5432,
      name: "nexus_dev",
    },
  },

  staging: {
    name: "staging",
    debug: false,
    apiUrl: "https://api-staging.nexus.app",
    wsUrl: "wss://ws-staging.nexus.app",
    logLevel: "info",
    features: {
      analytics: true,
      notifications: true,
      search: true,
      websocket: true,
    },
    database: {
      host: "staging-db.nexus.app",
      port: 5432,
      name: "nexus_staging",
    },
  },

  production: {
    name: "production",
    debug: false,
    apiUrl: "https://api.nexus.app",
    wsUrl: "wss://ws.nexus.app",
    logLevel: "warn",
    features: {
      analytics: true,
      notifications: true,
      search: true,
      websocket: true,
    },
    database: {
      host: "prod-db.nexus.app",
      port: 5432,
      name: "nexus_prod",
    },
  },
};

const currentConfig = config[ENV] || config.development;

module.exports = {
  ENV,
  config: currentConfig,
  isDev: ENV === "development",
  isProd: ENV === "production",
  isStaging: ENV === "staging",
  allConfigs: config,
};

// Si se ejecuta directamente
if (require.main === module) {
  console.log("🔧 Environment Configuration");
  console.log("═══════════════════════════════════════");
  console.log(`Environment: ${ENV}`);
  console.log(`Debug: ${currentConfig.debug}`);
  console.log(`API URL: ${currentConfig.apiUrl}`);
  console.log(`WebSocket: ${currentConfig.wsUrl}`);
  console.log(`Log Level: ${currentConfig.logLevel}`);
  console.log("\nFeatures:");
  Object.entries(currentConfig.features).forEach(([key, val]) => {
    console.log(`   ${val ? "✅" : "❌"} ${key}`);
  });
  console.log("═══════════════════════════════════════");
}
