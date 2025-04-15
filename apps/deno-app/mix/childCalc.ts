// mix/childCalc.ts
import { heavyCalc } from "../heavyCalc.ts";

const start = performance.now();
const result = heavyCalc();
const end = performance.now();

const cpuSec = ((end - start) / 1000).toFixed(2);

console.log(`[childCalcBinary] result=${result.toFixed(2)}`);
console.log(`[childCalcBinary] CPU part: ${cpuSec} s`);
console.log(
  `[childCalcBinary] RSS memory: ${(
    Deno.memoryUsage().heapTotal /
    (1024 * 1024)
  ).toFixed(1)} MB`
);
