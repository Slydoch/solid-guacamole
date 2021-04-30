module.exports = function(port: Number, host: String, requestListener: Function) {
  const http = require("http");
  const server = http.createServer(requestListener);
  server.listen(port, host, () => {
      console.log(`Server is running on http://${host}:${port}`);
  });
  return server;
};
