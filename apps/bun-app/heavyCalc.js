// heavyCalc.js

const ITERATIONS = 100_000_000;

function heavyCalc() {
  let sum = 0;
  for (let i = 0; i < ITERATIONS; i++) {
    const x = Math.sqrt(i) * Math.sin(i);
    const y = Math.log(i + 1) * Math.cos(i / 2);
    sum += x * y;
  }
  return sum;
}

module.exports = { heavyCalc };
