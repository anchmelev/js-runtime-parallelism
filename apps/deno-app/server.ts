import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  if (url.pathname === "/") {
    return new Response(
      JSON.stringify({ message: "Hello from Deno", timestamp: Date.now() }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } else if (url.pathname === "/delay") {
    const start = Date.now();
    while (Date.now() - start < 50) {}
    return new Response("Done with delay", { status: 200 });
  }
  return new Response("Not Found", { status: 404 });
}

serve(handler, { port: 3001 });
console.log("Deno server listening on port 3001");
