export default {
  port: 3002,
  fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === "/") {
      return new Response(
        JSON.stringify({ message: "Hello from Bun", timestamp: Date.now() }),
        { headers: { "Content-Type": "application/json" } }
      );
    } else if (url.pathname === "/delay") {
      const start = Date.now();
      while (Date.now() - start < 50) {}
      return new Response("Done with delay");
    }
    return new Response("Not Found", { status: 404 });
  },
};
