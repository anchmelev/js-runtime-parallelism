// bun-app/mix/child-cpu.js
const { heavyCalc } = require("../heavyCalc.js");

const start = performance.now();
const result = heavyCalc();
const end = performance.now();

console.log(`[mix-child:child-cpu] CPU finished. result=${result.toFixed(2)}`);
console.log(
  `[mix-child:child-cpu] CPU part: ${((end - start) / 1000).toFixed(2)} s`
);

const memMb = process.memoryUsage().rss / (1024 * 1024);
console.log(`[mix-child:child-cpu] RSS memory: ${memMb.toFixed(1)} MB`);
