const { heavyCalc } = require("../heavyCalc.js");

const N = 4;

const startTime = performance.now();
for (let i = 0; i < N; i++) {
  const result = heavyCalc();
  console.log(`Iteration #${i + 1} => sum: ${result}`);
}
const endTime = performance.now();

console.log(`heavyCalc total: ${(endTime - startTime).toFixed(2)} ms`);
