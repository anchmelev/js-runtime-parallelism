// mix/mix-workers.ts
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const PORT = 4100;

function handler(req: Request): Response {
  const url = new URL(req.url);
  if (url.pathname === "/json") {
    const data = { msg: "Hello from Deno mix-workers", time: Date.now() };
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  }
  return new Response("Not Found", { status: 404 });
}

serve(handler, { port: PORT });
console.log(`[mix-workers] Server on port ${PORT}`);

console.log("[mix-workers] Spawning worker for CPU...");
const worker = new Worker(new URL("./worker-calc.ts", import.meta.url).href, {
  type: "module",
});

// отправляем "start" сообщение
worker.postMessage("start");

worker.onmessage = (e) => {
  const { result, cpuSec, memoryMb } = e.data;
  console.log(`[mix-workers] CPU finished. result=${result.toFixed(2)}`);
  console.log(`[mix-workers] CPU part: ${cpuSec} s`);
  console.log(`[mix-workers] RSS memory: ${memoryMb} MB`);
};

worker.onerror = (err) => {
  console.error("[mix-workers] Worker error:", err);
};

// Так как serve(...) работает "бесконечно", Ctrl+C завершит run
