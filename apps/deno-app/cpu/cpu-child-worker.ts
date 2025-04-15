// cpu-child-worker.ts
import { heavyCalc } from "../heavyCalc.ts";

// Выполняем heavyCalc и выводим результат в stdout
const result = heavyCalc();
console.log(result);
