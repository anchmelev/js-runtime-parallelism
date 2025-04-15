// cpu-childprocs.js

const { spawn } = require("child_process");
const path = require("path");

async function runChild(script) {
  return new Promise((resolve, reject) => {
    const child = spawn("bun", ["run", script]); // Запуск bun run cpu-child-worker.js

    let output = "";
    child.stdout.on("data", (data) => {
      output += data.toString();
    });

    child.stderr.on("data", (data) => {
      console.error("CHILD ERR:", data.toString());
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve(output.trim());
      } else {
        reject(new Error(`Child process exited with code ${code}`));
      }
    });
  });
}

(async () => {
  const WORKERS_COUNT = 4;
  const script = path.join(__dirname, "cpu-child-worker.js");

  const startTime = performance.now();

  const tasks = [];
  for (let i = 0; i < WORKERS_COUNT; i++) {
    tasks.push(runChild(script));
  }

  const results = await Promise.all(tasks);

  const endTime = performance.now();
  console.log(`heavyCalc total: ${(endTime - startTime).toFixed(2)} ms`);
  console.log("All results:", JSON.stringify(results, null, 2));
})();
