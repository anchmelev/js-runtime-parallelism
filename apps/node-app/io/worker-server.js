// worker-server.js
const http = require("http");
const { workerData } = require("worker_threads");

const port = workerData.port;

// Простая JSON-обработка
function handleRequest(req, res) {
  if (req.url === "/json") {
    const data = {
      message: `Hello from Worker on port ${port}`,
      time: Date.now(),
    };
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
}

const server = http.createServer(handleRequest);

server.listen(port, () => {
  console.log(`Worker server started on port ${port}`);
});
