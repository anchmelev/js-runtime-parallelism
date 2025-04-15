// mix/child-cpu.js

const { heavyCalc } = require("../heavyCalc");

const startTime = process.hrtime.bigint();
const result = heavyCalc();
const endTime = process.hrtime.bigint();

const durationMs = Number(endTime - startTime) / 1e6;
const memMb = process.memoryUsage().rss / (1024 * 1024);

console.log(`[mix-child:child-cpu] CPU finished. result=${result.toFixed(2)}`);
console.log(
  `[mix-child:child-cpu] CPU part: ${(durationMs / 1000).toFixed(2)} s`
);
console.log(`[mix-child:child-cpu] RSS memory: ${memMb.toFixed(1)} MB`);
