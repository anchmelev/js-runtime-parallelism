// mix/worker-cpu.js

const { parentPort } = require("worker_threads");
const { heavyCalc } = require("../heavyCalc");

const startTime = process.hrtime.bigint();
const result = heavyCalc();
const endTime = process.hrtime.bigint();

const durationMs = Number(endTime - startTime) / 1e6;
const memMb = process.memoryUsage().rss / (1024 * 1024);

// Отправим данные в главный поток
parentPort.postMessage({
  result,
  cpuTimeSec: (durationMs / 1000).toFixed(2),
  memoryMb: memMb.toFixed(1),
});
