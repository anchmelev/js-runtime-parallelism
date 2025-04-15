const { spawn } = require("child_process");
const path = require("path");

function runChildProcess(script) {
  return new Promise((resolve, reject) => {
    const child = spawn("node", [script]);

    let output = "";
    child.stdout.on("data", (data) => {
      output += data.toString();
    });

    child.stderr.on("data", (data) => {
      console.error(data.toString());
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
  console.time("heavyCalc total");
  const WORKERS_COUNT = 4;
  const script = path.join(__dirname, "cpu-child-worker.js");

  const promises = [];
  for (let i = 0; i < WORKERS_COUNT; i++) {
    promises.push(runChildProcess(script));
  }

  const results = await Promise.all(promises);
  console.timeEnd("heavyCalc total");
  console.log("All results:", results);
})();
