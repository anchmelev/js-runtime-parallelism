// child-server.js
const http = require("http");

// Аргументом из cmd передаем номер порта
const port = parseInt(process.argv[2], 10) || 3200;

function handleRequest(req, res) {
  if (req.url === "/json") {
    const data = {
      message: `Hello from ChildProc on port ${port}`,
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
  console.log(`Child server listening on port ${port}`);
});

// Можно ловить SIGINT, если нужно
process.on("SIGINT", () => {
  server.close(() => {
    console.log(`ChildProc server on port ${port} closed`);
    process.exit(0);
  });
});
