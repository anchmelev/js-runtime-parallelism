// worker-server.ts

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

// порт получаем из onmessage
self.onmessage = (e: MessageEvent) => {
  const { port } = e.data;

  function handler(req: Request): Response {
    const url = new URL(req.url);
    if (url.pathname === "/json") {
      const data = {
        message: `Hello from Deno Worker on port ${port}`,
        time: Date.now(),
      };
      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response("Not Found", { status: 404 });
    }
  }

  console.log(`Worker: starting server on port ${port}...`);
  serve(handler, { port });
};
