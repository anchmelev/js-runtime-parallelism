// server-sequential.js

export default {
  port: 3000,
  fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === "/json") {
      const data = { message: "Hello from Bun (sequential)", time: Date.now() };
      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response("Not Found", { status: 404 });
  },
};
