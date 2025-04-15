// server-workers.js

try {
  const { Worker } = require("node:worker_threads");
  const NUM_WORKERS = 4;
  const BASE_PORT = 3100;

  for (let i = 0; i < NUM_WORKERS; i++) {
    const w = new Worker("./io/worker-server.js", {
      workerData: { port: BASE_PORT + i },
    });
  }

  console.log(
    `Started ${NUM_WORKERS} workers on ports ${BASE_PORT}..${
      BASE_PORT + NUM_WORKERS - 1
    }`
  );
} catch (err) {
  console.error(
    "Worker Threads might not be fully supported in this Bun version:",
    err
  );
}
