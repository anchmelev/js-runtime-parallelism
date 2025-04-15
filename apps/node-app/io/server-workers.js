// server-workers.js
const { Worker } = require("worker_threads");

const NUM_WORKERS = 4;
const BASE_PORT = 3100; // Базовый порт, воркеры будут слушать 3100, 3101, 3102, 3103

const workers = [];

function startWorker(port) {
  return new Worker(__dirname + "/worker-server.js", {
    workerData: { port },
  });
}

// Запускаем 4 воркера, каждый слушает свой порт
for (let i = 0; i < NUM_WORKERS; i++) {
  const port = BASE_PORT + i;
  const w = startWorker(port);
  workers.push(w);
}

console.log(
  `Started ${NUM_WORKERS} worker servers on ports ${BASE_PORT}–${
    BASE_PORT + NUM_WORKERS - 1
  }`
);

// Обработка сигнала для остановки всех воркеров
process.on("SIGINT", () => {
  console.log("Stopping all workers...");
  for (const w of workers) {
    w.terminate();
  }
  process.exit(0);
});
