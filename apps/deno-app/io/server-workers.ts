// server-workers.ts

const NUM_WORKERS = 4;
const BASE_PORT = 3100;

console.log(
  `Starting ${NUM_WORKERS} Deno Web Worker servers on ports ${BASE_PORT}..${
    BASE_PORT + NUM_WORKERS - 1
  }`
);

const workers: Worker[] = [];

for (let i = 0; i < NUM_WORKERS; i++) {
  const worker = new Worker(new URL("./worker-server.ts", import.meta.url).href, {
    type: "module",
  });
  const port = BASE_PORT + i;
  // Отправляем воркеру инфу о порте
  worker.postMessage({ port });
  workers.push(worker);
}

// Для остановки (Ctrl+C) - у каждого воркера нет graceful-shutdown, 
// но при SIGINT Deno обычно завершает весь процесс.
