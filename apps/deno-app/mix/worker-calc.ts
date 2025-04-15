// mix/worker-calc.ts

import { heavyCalc } from "../heavyCalc.ts";

self.onmessage = (_e) => {
  const start = performance.now();
  const result = heavyCalc();
  const end = performance.now();

  const cpuSec = ((end - start) / 1000).toFixed(2);

  const memMb = Deno.memoryUsage().heapTotal / (1024 * 1024);

  // отправляем данные
  self.postMessage({
    result,
    cpuSec,
    memoryMb: memMb.toFixed(1),
  });
  self.close();
};
