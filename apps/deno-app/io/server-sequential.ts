// server-sequential.ts

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

function handler(req: Request): Response {
  const url = new URL(req.url);
  if (url.pathname === "/json") {
    const data = {
      message: "Hello from Deno (sequential)",
      time: Date.now(),
    };
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } else {
    return new Response("Not Found", { status: 404 });
  }
}

console.log("Starting Deno sequential server on http://localhost:3000/json");
serve(handler, { port: 3000 });
