// worker_calc.ts

import { heavyCalc } from "../heavyCalc.ts";

/**
 * Веб-воркер в Deno не имеет "onmessage" по умолчанию,
 * но мы можем использовать "self.onmessage"
 * или "self.addEventListener('message', ...)".
 */

self.onmessage = (_e) => {
  // Выполняем тяжелую функцию
  const sum = heavyCalc();
  // Отправляем результат
  self.postMessage(sum);
  self.close();
};
