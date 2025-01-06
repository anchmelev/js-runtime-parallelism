const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;

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

app.get("/", (req, res) => {
  res.send("Hello from Node.js (mixed scenario)");
});

app.get("/start-cpu", (req, res) => {
  console.time("primeSearch");
  const prime = findPrimeSync(5_000_000);
  console.timeEnd("primeSearch");
  res.send(`Closest prime >= 5_000_000 is ${prime}`);
});

app.listen(PORT, () => {
  console.log(`Node.js mixed server on port ${PORT}`);
});
