function isPrime(num) {
  if (num < 2) return false;
  if (num % 2 === 0 && num !== 2) return false;
  for (let i = 3; i <= Math.sqrt(num); i += 2) {
    if (num % i === 0) return false;
  }
  return true;
}

function findPrimeSync(target) {
  let candidate = target;
  while (!isPrime(candidate)) {
    candidate++;
  }
  return candidate;
}

export default {
  port: 4002,
  fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === "/") {
      return new Response("Hello from Bun (mixed scenario)");
    } else if (url.pathname === "/start-cpu") {
      console.time("primeSearch");
      const prime = findPrimeSync(5_000_000);
      console.timeEnd("primeSearch");
      return new Response(`Closest prime >= 5_000_000 is ${prime}`);
    }
    return new Response("Not Found", { status: 404 });
  },
};
