// server-sequential.js
const http = require("http");

const PORT = 3000; // Порт для однопоточного сервера

// Простейший JSON-обработчик
function handleRequest(req, res) {
  if (req.url === "/json") {
    // Эмулируем небольшую работу, например parse/stringify
    const data = { message: "Hello from sequential", time: Date.now() };
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
}

const server = http.createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`Sequential server listening on port ${PORT}`);
});

// Чтобы корректно остановить сервер извне, можно:
process.on("SIGINT", () => {
  server.close(() => {
    console.log("Sequential server closed");
    process.exit(0);
  });
});
