/**
 * task-scheduler.js
 * Scheduler de tareas periódicas usando Node.js timers.
 * Corre con: node scripts/scheduler/task-scheduler.js
 */

const { exec } = require("child_process");
const path = require("path");

class TaskScheduler {
  constructor() {
    this.tasks = new Map();
    this.running = false;
  }

  add(name, intervalMs, taskFn) {
    this.tasks.set(name, {
      intervalMs,
      taskFn,
      lastRun: null,
      runCount: 0,
      timer: null,
    });
    console.log(`➕ Task added: ${name} (every ${intervalMs}ms)`);
    return this;
  }

  start() {
    if (this.running) return;
    this.running = true;
    console.log("▶️  Scheduler started\n");

    for (const [name, task] of this.tasks) {
      // Ejecutar inmediatamente
      this._runTask(name);
      // Programar repeticiones
      task.timer = setInterval(() => this._runTask(name), task.intervalMs);
    }
  }

  _runTask(name) {
    const task = this.tasks.get(name);
    if (!task) return;

    const startTime = Date.now();
    task.runCount++;

    console.log(`🔄 [${new Date().toLocaleTimeString()}] Running: ${name} (#${task.runCount})`);

    try {
      task.taskFn();
      const duration = Date.now() - startTime;
      task.lastRun = new Date();
      console.log(`✅ [${new Date().toLocaleTimeString()}] Completed: ${name} (${duration}ms)\n`);
    } catch (err) {
      console.error(`❌ [${new Date().toLocaleTimeString()}] Failed: ${name} - ${err.message}\n`);
    }
  }

  stop() {
    this.running = false;
    for (const [name, task] of this.tasks) {
      if (task.timer) {
        clearInterval(task.timer);
        console.log(`⏹️  Stopped: ${name} (${task.runCount} runs)`);
      }
    }
    console.log("\n⏹️  Scheduler stopped");
  }

  status() {
    console.log("\n📋 Scheduler Status:");
    console.log("═══════════════════════════════════════");
    for (const [name, task] of this.tasks) {
      console.log(`📌 ${name}`);
      console.log(`   Interval: ${task.intervalMs}ms`);
      console.log(`   Runs: ${task.runCount}`);
      console.log(`   Last run: ${task.lastRun ? task.lastRun.toLocaleTimeString() : "Never"}`);
      console.log("");
    }
    console.log("═══════════════════════════════════════");
  }
}

// --- Tareas de ejemplo ---

const scheduler = new TaskScheduler();

// Tarea 1: Generar métricas cada 10 segundos
scheduler.add("generate-metrics", 10000, () => {
  const metrics = {
    timestamp: new Date().toISOString(),
    cpu: process.cpuUsage(),
    memory: process.memoryUsage(),
    uptime: process.uptime(),
  };
  console.log("   📊 Metrics:", JSON.stringify(metrics, null, 2));
});

// Tarea 2: Verificar archivos cada 15 segundos
scheduler.add("file-check", 15000, () => {
  const fs = require("fs");
  const criticalFiles = ["package.json", "next.config.ts", ".env"];
  for (const file of criticalFiles) {
    const exists = fs.existsSync(path.join(__dirname, "..", "..", file));
    console.log(`   ${exists ? "✅" : "❌"} ${file}`);
  }
});

// Tarea 3: Heartbeat cada 5 segundos
scheduler.add("heartbeat", 5000, () => {
  console.log(`   💓 Heartbeat - Memory: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`);
});

// Iniciar
scheduler.start();

// Mostrar status después de 3 segundos
setTimeout(() => scheduler.status(), 3000);

// Detener después de 60 segundos
setTimeout(() => {
  scheduler.stop();
  process.exit(0);
}, 60000);

// Manejar Ctrl+C
process.on("SIGINT", () => {
  scheduler.stop();
  process.exit(0);
});
