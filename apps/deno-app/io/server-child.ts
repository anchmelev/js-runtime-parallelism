const BASE_PORT = 3200;
const NUM_PROCS = 4;
const procs: Deno.Process[] = [];

for (let i = 0; i < NUM_PROCS; i++) {
  const port = BASE_PORT + i;
  const p = Deno.run({
    cmd: ["./io/childServerBinary", String(port)],
    stdout: "inherit",
    stderr: "inherit",
  });
  procs.push(p);
}

console.log(
  `(server-child) Started ${NUM_PROCS} child servers on ports ${BASE_PORT}..${
    BASE_PORT + NUM_PROCS - 1
  }`
);

for (const p of procs) {
  p.status().then((st) => {
    console.log(`One of the child servers exited with code: ${st.code}`);
  });
}
