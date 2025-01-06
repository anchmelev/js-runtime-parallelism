function isPrime(num: number): boolean {
  if (num < 2) return false;
  if (num % 2 === 0 && num !== 2) return false;
  for (let i = 3; i <= Math.sqrt(num); i += 2) {
    if (num % i === 0) return false;
  }
  return true;
}

const TARGET = 10_000_000;
console.time("primeSearch");
let candidate = TARGET;
while (!isPrime(candidate)) {
  candidate++;
}
console.timeEnd("primeSearch");
console.log(`Closest prime >= ${TARGET} is ${candidate}`);
