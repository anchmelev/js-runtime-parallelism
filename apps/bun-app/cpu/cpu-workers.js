// cpu-workers.js
try {
  const { Worker, isMainThread, parentPort } = require("node:worker_threads");
  const { heavyCalc } = require("../heavyCalc.js");

  if (!isMainThread) {
    // Код, исполняемый воркером
    const sum = heavyCalc();
    parentPort.postMessage(sum);
  } else {
    // Главный поток
    const WORKERS_COUNT = 4;

    async function runWorker() {
      return new Promise((resolve, reject) => {
        const worker = new Worker(__filename); // тот же файл
        worker.on("message", (msg) => resolve(msg));
        worker.on("error", reject);
        worker.on("exit", (code) => {
          if (code !== 0)
            reject(new Error(`Worker stopped with exit code ${code}`));
        });
      });
    }

    (async () => {
      const startTime = performance.now();

      const tasks = [];
      for (let i = 0; i < WORKERS_COUNT; i++) {
        tasks.push(runWorker());
      }
      const results = await Promise.all(tasks);

      const endTime = performance.now();
      console.log(`heavyCalc total: ${(endTime - startTime).toFixed(2)} ms`);
      console.log("All results:", JSON.stringify(results, null, 2));
    })();
  }
} catch (err) {
  console.error("Worker Threads not supported or error occurred:", err);
}
