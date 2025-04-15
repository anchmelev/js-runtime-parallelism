// cpu-sequential.ts

import { heavyCalc } from "../heavyCalc.ts";

const N = 4;

console.time("heavyCalc total");
for (let i = 0; i < N; i++) {
  const result = heavyCalc();
  console.log(`Iteration #${i + 1} => sum: ${result}`);
}
console.timeEnd("heavyCalc total");
