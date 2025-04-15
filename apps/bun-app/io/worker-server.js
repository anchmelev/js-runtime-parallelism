// worker-server.js
const { workerData, parentPort } = require("node:worker_threads");
const port = workerData.port;

// Bun-стиль сервера:
export default {
  port,
  fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === "/json") {
      const data = {
        message: `Hello from Bun Worker on port ${port}`,
        time: Date.now(),
      };
      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response("Not Found", { status: 404 });
  },
};
