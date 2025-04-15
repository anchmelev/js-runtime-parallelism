// bun-app/mix/mix-sequential.js
import { serve } from "bun";
const { heavyCalc } = require("../heavyCalc.js");

const PORT = 4000;

serve({
  port: PORT,
  fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/json") {
      const data = { msg: "Hello from Bun sequential", time: Date.now() };
      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`[mix-sequential] Server listening on port ${PORT}`);

// Синхронно запускаем CPU-тяжёлую задачу — это блокирует весь event loop:
console.log("[mix-sequential] Starting CPU task...");
const start = performance.now();
const result = heavyCalc();
const end = performance.now();

console.log(`[mix-sequential] CPU finished. result=${result.toFixed(2)}`);
console.log(
  `[mix-sequential] CPU part: ${((end - start) / 1000).toFixed(2)} s`
);

const memMb = (Bun.gc(true), process.memoryUsage().rss / (1024 * 1024));
console.log(`[mix-sequential] RSS memory: ${memMb.toFixed(1)} MB`);

// Bun автоматически продолжает слушать порт, пока не убьём процесс (Ctrl+C / kill).
