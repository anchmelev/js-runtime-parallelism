// server-child.js

import { spawn } from "bun";

const NUM_PROCS = 4;
const BASE_PORT = 3200;

for (let i = 0; i < 4; i++) {
  const port = BASE_PORT + i;
  spawn({
    cmd: ["bun", "run", "./io/child-server.js", String(port)],
    stdout: "inherit",
    stderr: "inherit",
  });
}

console.log(
  `Started ${NUM_PROCS} child processes on ports ${BASE_PORT}..${
    BASE_PORT + NUM_PROCS - 1
  }`
);
