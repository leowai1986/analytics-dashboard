/**
 * data-migration.js
 * Sistema de migraciones de datos con versionado.
 * Corre con: node scripts/migration/data-migration.js
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const MIGRATIONS_DIR = path.join(__dirname, "migrations");
const STATE_FILE = path.join(__dirname, ".migration-state.json");

// Crear directorio de migraciones
if (!fs.existsSync(MIGRATIONS_DIR)) {
  fs.mkdirSync(MIGRATIONS_DIR, { recursive: true });
}

// Estado de migraciones
function loadState() {
  if (fs.existsSync(STATE_FILE)) {
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));
  }
  return { version: 0, migrations: [] };
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

// Definición de migraciones
const migrations = [
  {
    version: 1,
    name: "add-user-roles",
    up: () => {
      console.log("   🔧 Adding user roles...");
      // Simular migración
      return { usersUpdated: 150 };
    },
    down: () => {
      console.log("   🔧 Removing user roles...");
      return { usersUpdated: 150 };
    },
  },
  {
    version: 2,
    name: "add-session-tracking",
    up: () => {
      console.log("   🔧 Adding session tracking...");
      return { sessionsCreated: 5000 };
    },
    down: () => {
      console.log("   🔧 Removing session tracking...");
      return { sessionsRemoved: 5000 };
    },
  },
  {
    version: 3,
    name: "normalize-emails",
    up: () => {
      console.log("   🔧 Normalizing email addresses...");
      return { emailsNormalized: 230 };
    },
    down: () => {
      console.log("   🔧 Reverting email normalization...");
      return { emailsReverted: 230 };
    },
  },
];

function migrate(targetVersion = null) {
  const state = loadState();
  const currentVersion = state.version;

  if (targetVersion === null) {
    targetVersion = migrations[migrations.length - 1].version;
  }

  console.log(`📊 Current version: ${currentVersion}`);
  console.log(`🎯 Target version: ${targetVersion}\n`);

  if (targetVersion > currentVersion) {
    // Migrar hacia arriba
    for (const migration of migrations) {
      if (migration.version > currentVersion && migration.version <= targetVersion) {
        console.log(`⬆️  Migrating: v${migration.version} - ${migration.name}`);
        const result = migration.up();
        console.log(`   ✅ Result:`, result);

        state.version = migration.version;
        state.migrations.push({
          version: migration.version,
          name: migration.name,
          direction: "up",
          executedAt: new Date().toISOString(),
          checksum: crypto.createHash("sha256").update(migration.name).digest("hex"),
        });
      }
    }
  } else if (targetVersion < currentVersion) {
    // Rollback
    for (let i = migrations.length - 1; i >= 0; i--) {
      const migration = migrations[i];
      if (migration.version <= currentVersion && migration.version > targetVersion) {
        console.log(`⬇️  Rolling back: v${migration.version} - ${migration.name}`);
        const result = migration.down();
        console.log(`   ✅ Result:`, result);

        state.version = migration.version - 1;
        state.migrations.push({
          version: migration.version,
          name: migration.name,
          direction: "down",
          executedAt: new Date().toISOString(),
          checksum: crypto.createHash("sha256").update(migration.name).digest("hex"),
        });
      }
    }
  } else {
    console.log("✅ Already at target version");
    return;
  }

  saveState(state);
  console.log(`\n🎉 Migration complete! Now at version ${state.version}`);
}

function status() {
  const state = loadState();
  console.log("📋 Migration Status");
  console.log("═══════════════════════════════════════");
  console.log(`Current version: ${state.version}`);
  console.log(`Total migrations run: ${state.migrations.length}\n`);

  console.log("History:");
  for (const m of state.migrations) {
    const arrow = m.direction === "up" ? "⬆️ " : "⬇️ ";
    console.log(`   ${arrow} v${m.version} ${m.name} (${m.executedAt})`);
  }

  console.log("\nAvailable migrations:");
  for (const m of migrations) {
    const applied = state.migrations.some((sm) => sm.version === m.version && sm.direction === "up");
    console.log(`   ${applied ? "✅" : "⬜"} v${m.version} ${m.name}`);
  }
  console.log("═══════════════════════════════════════");
}

// CLI
const command = process.argv[2];
const arg = process.argv[3];

switch (command) {
  case "up":
    migrate(arg ? parseInt(arg) : null);
    break;
  case "down":
    migrate(parseInt(arg) || 0);
    break;
  case "status":
    status();
    break;
  default:
    console.log("Usage:");
    console.log("  node data-migration.js up [version]    # Migrate up");
    console.log("  node data-migration.js down [version]  # Rollback");
    console.log("  node data-migration.js status          # Show status");
}
