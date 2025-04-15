// cpu-workers.ts

console.time("heavyCalc total");

// В Deno создание воркера:
function createWorker(scriptUrl: string): Promise<number> {
  return new Promise((resolve, reject) => {
    // Указываем тип воркера: "module"
    const worker = new Worker(scriptUrl, { type: "module" });

    // Получаем результат
    worker.onmessage = (e) => {
      const val = e.data as number;
      worker.terminate();
      resolve(val);
    };

    worker.onerror = (err) => {
      reject(err);
    };

    // Шлём любую "задачу", если нужно,
    // но здесь воркер сам знает, что делать.
    worker.postMessage("start");
  });
}

(async () => {
  const WORKERS_COUNT = 4;
  const tasks: Array<Promise<number>> = [];

  for (let i = 0; i < WORKERS_COUNT; i++) {
    // Запускаем воркер на базе worker_calc.ts
    tasks.push(createWorker(new URL("./worker_calc.ts", import.meta.url).href));
  }

  const results = await Promise.all(tasks);

  console.timeEnd("heavyCalc total");
  console.log("All results:", results);
})();
