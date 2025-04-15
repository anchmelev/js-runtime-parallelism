// mix/mix-sequential.js

const http = require("http");
const { heavyCalc } = require("../heavyCalc");

const PORT = 4000;

const server = http.createServer((req, res) => {
  if (req.url === "/json") {
    // Короткий JSON-ответ
    const data = { msg: "Hello from mix-sequential", time: Date.now() };
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

server.listen(PORT, () => {
  console.log(`[mix-sequential] Server listening on port ${PORT}`);

  // Сразу запускаем CPU-нагрузку (блокирует event loop!)
  console.log("[mix-sequential] Starting CPU task...");
  const startTime = process.hrtime.bigint();

  const result = heavyCalc();

  const endTime = process.hrtime.bigint();
  const durationMs = Number(endTime - startTime) / 1e6;
  console.log(
    `[mix-sequential] CPU task finished. result=${result.toFixed(2)}`
  );
  console.log(`[mix-sequential] CPU part: ${(durationMs / 1000).toFixed(2)} s`);

  // Расход памяти
  const memMb = process.memoryUsage().rss / (1024 * 1024);
  console.log(`[mix-sequential] RSS memory: ${memMb.toFixed(1)} MB`);
});

// При завершении убиваем сервер
process.on("SIGINT", () => {
  console.log("[mix-sequential] Shutting down...");
  server.close(() => process.exit(0));
});
