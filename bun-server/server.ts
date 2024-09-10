Bun.serve({
  fetch(request, server) {
    const url = new URL(request.url);
    if (url.pathname === "/api/dailystat") {
      return new Response(JSON.stringify({ dailystat }));
    }
    return server.fetch(request);
  },
});
