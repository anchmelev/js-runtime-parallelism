import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

function isPrime(num: number): boolean {
  if (num < 2) return false;
  if (num % 2 === 0 && num !== 2) return false;
  for (let i = 3; i <= Math.sqrt(num); i += 2) {
    if (num % i === 0) return false;
  }
  return true;
}

function findPrimeSync(target: number): number {
  let candidate = target;
  while (!isPrime(candidate)) {
    candidate++;
  }
  return candidate;
}

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  if (url.pathname === "/") {
    return new Response("Hello from Deno (mixed scenario)");
  } else if (url.pathname === "/start-cpu") {
    console.time("primeSearch");
    const prime = findPrimeSync(5_000_000);
    console.timeEnd("primeSearch");
    return new Response(`Closest prime >= 5_000_000 is ${prime}`);
  }
  return new Response("Not Found", { status: 404 });
}

serve(handler, { port: 4001 });
console.log("Deno mixed server on port 4001");
