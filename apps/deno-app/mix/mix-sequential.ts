// mix/mix-sequential.ts

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { heavyCalc } from "../heavyCalc.ts";

const PORT = 4000;

// Поднимаем HTTP-сервер
function handler(req: Request): Response {
  const url = new URL(req.url);
  if (url.pathname === "/json") {
    const data = { msg: "Hello from Deno mix-sequential", time: Date.now() };
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  }
  return new Response("Not Found", { status: 404 });
}

serve(handler, { port: PORT });
console.log(`[mix-sequential] Server listening on port ${PORT}`);

// Синхронно вызываем heavyCalc — заблокируем event loop
console.log("[mix-sequential] Starting CPU task...");
const start = performance.now();
const result = heavyCalc();
const end = performance.now();

const cpuSec = ((end - start) / 1000).toFixed(2);
console.log(`[mix-sequential] CPU finished. result=${result.toFixed(2)}`);
console.log(`[mix-sequential] CPU part: ${cpuSec} s`);

const memMb = Deno.memoryUsage().heapTotal / (1024 * 1024);
console.log(`[mix-sequential] RSS memory: ${memMb.toFixed(1)} MB`);

// Не завершаем процесс: serve(...) держит событие.
// Остановка Ctrl+C (SIGINT) завершит run.
