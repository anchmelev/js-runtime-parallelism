import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

// Читаем порт из Deno.args
const portArg = Deno.args[0];
const port = portArg ? parseInt(portArg, 10) : 3200;

function handler(req: Request): Response {
  const url = new URL(req.url);
  if (url.pathname === "/json") {
    const data = {
      message: `Hello from Deno child proc on port ${port}`,
      time: Date.now(),
    };
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  }
  return new Response("Not Found", { status: 404 });
}

console.log(`Child proc server on port ${port} started`);

// Обратите внимание: здесь нужен await!
await serve(handler, { port });
// Код после serve(...) никогда не будет выполнен,
// потому что serve() возвращает Promise<never>.
