// index.js: Performs all setup for express web application

// Load all necessary packages
const core = require("./lib/core.js");
const logger = require("./lib/utils/logger");

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

try {
  // initialize the htpp server
  const server = createServer(core);

  // Start the server and listen on the desired port
  server.listen(core.server.port, "0.0.0.0", () => {
    logger.info(`Server is listening on: 0.0.0.0:${core.server.port}`);
  });
} catch (err) {
  logger.error(err.message);
}
