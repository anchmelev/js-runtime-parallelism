// bun-app/mix/mix-workers.js

const PORT = 4100;

export default {
  port: PORT,
  fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/json") {
      const data = {
        msg: "Hello from Bun worker main thread",
        time: Date.now(),
      };
      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response("Not Found", { status: 404 });
  },
};

console.log(`[mix-workers] Server listening on port ${PORT}`);

// Создаём Web Worker
const workerUrl = new URL("./worker-cpu.js", import.meta.url).href;
const cpuWorker = new Worker(workerUrl, { type: "module" });

cpuWorker.onmessage = (e) => {
  const { result, cpuTimeSec, memoryMb } = e.data;
  console.log(`[mix-workers] CPU finished. result=${result.toFixed(2)}`);
  console.log(`[mix-workers] CPU part: ${cpuTimeSec} s`);
  console.log(`[mix-workers] RSS memory: ${memoryMb} MB`);
};

cpuWorker.onerror = (err) => {
  console.error("[mix-workers] Worker error:", err);
};

// Запустим CPU
console.log("[mix-workers] Spawning CPU worker...");
cpuWorker.postMessage("start");
