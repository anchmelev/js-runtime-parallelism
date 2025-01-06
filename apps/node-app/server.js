// apps/node-app/server.js
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({ message: "Hello from Node.js", timestamp: Date.now() });
});

app.get("/delay", (req, res) => {
  // Имитация 50мс задержки в том же потоке
  const start = Date.now();
  while (Date.now() - start < 50) {}
  res.send("Done with delay");
});

app.listen(PORT, () => {
  console.log(`Node.js server listening on port ${PORT}`);
});
