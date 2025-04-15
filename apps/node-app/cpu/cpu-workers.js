// cpu-workers.js
const { Worker, isMainThread, parentPort } = require("worker_threads");
const { heavyCalc } = require("../heavyCalc");

if (!isMainThread) {
  const sum = heavyCalc();
  parentPort.postMessage(sum);
} else {
  const WORKERS_COUNT = 4;
  console.time("heavyCalc total");

  function runWorker() {
    return new Promise((resolve, reject) => {
      const worker = new Worker(__filename);
      worker.on("message", (msg) => resolve(msg));
      worker.on("error", reject);
      worker.on("exit", (code) => {
        if (code !== 0)
          reject(new Error(`Worker stopped with exit code ${code}`));
      });
    });
  }

  (async () => {
    const tasks = [];
    for (let i = 0; i < WORKERS_COUNT; i++) {
      tasks.push(runWorker());
    }
    const results = await Promise.all(tasks);
    console.timeEnd("heavyCalc total");
    console.log("All results:", results);
  })();
}
