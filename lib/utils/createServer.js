// createServer.js:

"use strict";

// Load all necessary packages
const fs = require("fs");
const http = require("http");
const https = require("https");

// Function to create the server
function createServer(core) {
  // If not in production mode, use local SSL certificates and create an HTTPS server
  if (!core.isProduction) {
    return https.createServer(
      {
        key: fs.readFileSync("../../ssl-certs/web-starter.key"), // Path to your SSL private key
        cert: fs.readFileSync("../../ssl-certs/web-starter.crt"), // Path to your SSL certificate (with SANs)
      },
      core.app
    );
  } else {
    // When in production, create a plain HTTP server as the runtime environment handles SSL
    return http.createServer(core.app);
  }
}

// export all functions
module.exports = createServer;
