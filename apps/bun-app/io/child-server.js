// child-server.js

const port = process.argv[2] ? parseInt(process.argv[2], 10) : 3200;

export default {
  port,
  fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === "/json") {
      const data = {
        message: `Hello from Bun Child on port ${port}`,
        time: Date.now(),
      };
      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response("Not Found", { status: 404 });
  },
};
