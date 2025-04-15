// heavyCalc.ts

const ITERATIONS = 100_000_000;

/**
 * Выполняет «тяжёлый» цикл из ITERATIONS итераций,
 * используя несколько «дорогих» математических операций
 * (sqrt, sin, cos, log).
 */
export function heavyCalc(): number {
  let sum = 0;
  for (let i = 0; i < ITERATIONS; i++) {
    const x = Math.sqrt(i) * Math.sin(i);
    const y = Math.log(i + 1) * Math.cos(i / 2);
    sum += x * y;
  }
  return sum;
}
