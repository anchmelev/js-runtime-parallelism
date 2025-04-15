// mix/mix-childprocs.ts

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

// 1) Поднимаем HTTP-сервер (I/O)
const PORT = 4200;

function handler(req: Request): Response {
  const url = new URL(req.url);
  if (url.pathname === "/json") {
    const data = { msg: "Hello from Deno mix-childprocs", time: Date.now() };
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  }
  return new Response("Not Found", { status: 404 });
}

serve(handler, { port: PORT });
console.log(`[mix-childprocs] Server on port ${PORT}`);

// 2) Запускаем 4 бинарника (childCalcBinary)
console.log("[mix-childprocs] Spawning 4 child procs...");

const WORKERS_COUNT = 4;

// Путь к скомпилированному бинарнику childCalcBinary
const binPath = new URL("./childCalcBinary", import.meta.url).pathname;

// helper-функция
async function runChild(binPath: string): Promise<string> {
  const p = Deno.run({
    cmd: [binPath],
    stdout: "piped",
    stderr: "piped",
  });

  const status = await p.status();
  const rawOut = await p.output();
  const outStr = new TextDecoder().decode(rawOut);
  const rawErr = await p.stderrOutput();
  const errStr = new TextDecoder().decode(rawErr);

  p.close();

  if (!status.success) {
    throw new Error(`childCalcBinary failed:\n${errStr}`);
  }
  return outStr.trim();
}

const promises: Promise<string>[] = [];
for (let i = 0; i < WORKERS_COUNT; i++) {
  promises.push(runChild(binPath));
}

Promise.all(promises)
  .then((res) => {
    console.log("[mix-childprocs] All results:\n", res);
  })
  .catch((err) => {
    console.error("[mix-childprocs] child error:", err);
  });

// Поскольку serve(...) «висит», Ctrl+C останавливает run
