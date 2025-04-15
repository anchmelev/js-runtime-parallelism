// mix/mix-workers.js

const http = require("http");
const { Worker } = require("worker_threads");
const PORT = 4100;

const server = http.createServer((req, res) => {
  if (req.url === "/json") {
    const data = {
      msg: "Hello from mix-workers main thread",
      time: Date.now(),
    };
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

server.listen(PORT, () => {
  console.log(`[mix-workers] Server listening on port ${PORT}`);

  console.log("[mix-workers] Spawning worker for CPU...");
  const worker = new Worker(__dirname + "/worker-cpu.js");

  worker.on("message", (msg) => {
    console.log(`[mix-workers] CPU finished. result=${msg.result.toFixed(2)}`);
    console.log(`[mix-workers] CPU part: ${msg.cpuTimeSec} s`);
    console.log(`[mix-workers] RSS memory: ${msg.memoryMb} MB`);
  });

  worker.on("error", (err) => {
    console.error("[mix-workers] Worker error:", err);
  });

  worker.on("exit", (code) => {
    console.log(`[mix-workers] Worker exit code: ${code}`);
  });
});

// Завершение
process.on("SIGINT", () => {
  console.log("[mix-workers] Shutting down...");
  server.close(() => process.exit(0));
});
