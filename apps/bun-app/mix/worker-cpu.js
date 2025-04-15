// bun-app/mix/worker-cpu.js
const { heavyCalc } = require("../heavyCalc.js");

self.onmessage = () => {
  const start = performance.now();
  const result = heavyCalc();
  const end = performance.now();

  const memMb = process.memoryUsage().rss / (1024 * 1024);

  // Отправляем обратно
  self.postMessage({
    result,
    cpuTimeSec: ((end - start) / 1000).toFixed(2),
    memoryMb: memMb.toFixed(1),
  });
};
