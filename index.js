// index.js: Performs all setup for express web application

// load all necessary packages
const fs = require("fs");
const http = require("http");
const https = require("https");
const core = require("./lib/core.js");

// pass all modules needed to setup the application
core.setupModules([
  "./lib/setups/express",
  "./lib/setups/handlebars",
  "./lib/setups/libsql-orm",
  "./lib/features/home/setup",
  "./lib/features/about/setup",
  "./lib/features/contact/setup",
  "./lib/features/support/setup",
]);

function createServer() {
  // if not in production mode then use local ssl certificates  and create https server
  if (!core.isProduction) {
    return https.createServer(
      {
        key: fs.readFileSync("localhost-key.pem"),
        cert: fs.readFileSync("localhost.pem"),
      },
      core.app
    );
  } else {
    // when in production create plain http server as runtime environment handles ssl layer
    return http.createServer(core.app);
  }
}

try {
  const server = createServer();

  server.listen(core.server.port, () => {
    console.log(`Server is listening on port ${core.server.port}`);
  });
} catch (err) {
  console.error(err.message);
}
