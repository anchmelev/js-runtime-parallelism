// mix/mix-child.js

const http = require("http");
const { spawn } = require("child_process");
const path = require("path");

const PORT = 4200;

const server = http.createServer((req, res) => {
  if (req.url === "/json") {
    const data = { msg: "Hello from mix-child main process", time: Date.now() };
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

server.listen(PORT, () => {
  console.log(`[mix-child] Server listening on port ${PORT}`);

  console.log("[mix-child] Spawning child for CPU...");
  const script = path.join(__dirname, "child-cpu.js");
  const cp = spawn("node", [script], { stdio: "inherit" });
});

process.on("SIGINT", () => {
  console.log("[mix-child] Shutting down...");
  server.close(() => process.exit(0));
});
