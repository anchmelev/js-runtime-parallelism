// server-child.js
const { spawn } = require("child_process");
const path = require("path");

const NUM_PROCS = 4;
const BASE_PORT = 3200;
const processes = [];

for (let i = 0; i < NUM_PROCS; i++) {
  const port = BASE_PORT + i;
  // Запускаем node child-server.js <port>
  const childPath = path.join(__dirname, "child-server.js");
  const cp = spawn("node", [childPath, port], { stdio: "inherit" });
  processes.push(cp);
}

console.log(
  `Started ${NUM_PROCS} child servers on ports ${BASE_PORT}–${
    BASE_PORT + NUM_PROCS - 1
  }`
);

process.on("SIGINT", () => {
  console.log("Stopping all child processes...");
  for (const cp of processes) {
    cp.kill("SIGINT");
  }
  process.exit(0);
});
