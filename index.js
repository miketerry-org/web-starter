/**
 * !!mike, the express-tenants package is currently using a global link because i am not finished fixing bugs in it.  once fixed i need to republish and remove link usage
 *
 */
// index.js: Performs all setup for express web application

// Load all necessary packages
const fs = require("fs");
const http = require("http");
const https = require("https");
const core = require("./lib/core.js");

// Pass all modules needed to setup the application
core.setupModules([
  "./lib/setups/express",
  "./lib/setups/handlebars",
  "./lib/setups/mongoose",
  "./lib/features/home/setup",
  "./lib/features/about/setup",
  "./lib/features/contact/setup",
  "./lib/features/support/setup",
  "./lib/features/auth/setup",
]);

// Function to create the server
function createServer() {
  // If not in production mode, use local SSL certificates and create an HTTPS server
  if (!core.isProduction) {
    return https.createServer(
      {
        key: fs.readFileSync("./ssl-certs/web-starter.key"), // Path to your SSL private key
        cert: fs.readFileSync("./ssl-certs/web-starter.crt"), // Path to your SSL certificate (with SANs)
      },
      core.app
    );
  } else {
    // When in production, create a plain HTTP server as the runtime environment handles SSL
    return http.createServer(core.app);
  }
}

try {
  const server = createServer();

  // Start the server and listen on the desired port
  server.listen(core.server.port, "0.0.0.0", () => {
    console.log(`Server is listening on: 0.0.0.0:${core.server.port}`);
  });
} catch (err) {
  console.error(err.message);
}
