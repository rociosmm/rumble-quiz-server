const { app, server } = require("./app.js");
const { PORT = 9090 } = process.env;

server.listen(PORT, "0.0.0.0", async () =>
  console.log(`Listening on ${PORT}...`)
);
