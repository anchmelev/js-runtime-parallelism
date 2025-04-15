// bun-app/mix/mix-child.js

export default {
  port: 4200,
  fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === "/json") {
      const data = {
        msg: "Hello from Bun child main process",
        time: Date.now(),
      };
      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response("Not Found", { status: 404 });
  },
};

console.log("[mix-child] Server listening on port 4200");

// Запуск CPU через Bun.spawn
import { spawn } from "bun";

console.log("[mix-child] Spawning child for CPU...");
spawn({
  cmd: ["bun", "run", new URL("./child-cpu.js", import.meta.url).pathname],
  stdout: "inherit",
  stderr: "inherit",
});
