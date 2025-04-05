// config.js:

"use strict";

// load all necessary modules
const path = require("path");
const Confirm = require("confirm-json");
const TopSecret = require("topsecret");

// define global server configuration object
let serverConfig = undefined;

try {
  // expand the encrypted server configuration filename
  const filename = path.resolve("config-server.secure");

  // instantiate class to decrypt server configuration file
  const topsecret = new TopSecret();

  // assign the encryption key which must be defined in process environment variables
  topsecret.key = process.env.ENCRYPT_KEY;

  // now attempt to load and decrypt the server configuration variables
  serverConfig = topsecret.decryptJSONFromFile(filename);

  // confirm all server configuration properties are valid
  let results = new Confirm(serverConfig)
    .isInteger("server_port", 8000, 1000, 60000)
    .isString("log_db_url", undefined, 1, 255)
    .isString("log_collection_name", undefined, 1, 255)
    .isInteger("log_expiration_days", undefined, 1, 365)
    .isBoolean("log_capped", undefined)
    .isInteger("log_max_size", undefined, 1, 1000000)
    .isInteger("log_max_docs", undefined, 1000, 1000000)
    .isString("session_db_url", undefined, 1, 255)
    .isString("session_collection_name", undefined, 1, 255)
    .isString("session_secret", undefined, 20, 255)
    .isInteger("session_timeout", undefined, 1, 24 * 60)
    .isInteger("rate_limit_minutes", undefined, 1, 60)
    .isInteger("rate_limit_requests", undefined, 10, 6000)
    .isString("path_static", "public", 1, 255)
    .isString("path_views", "views", 1, 255)
    .isString("path_views_layouts", "views/layouts", 1, 255)
    .isString("path_views_partials", "views/partials", 1, 255)
    .isString("path_views_default_layout", "layout", 1, 255);

  // if one or more errors then throw  error which will cause program to halt
  if (results.errors.length > 0) {
    throw new Error(results.errors.join("\n"));
  }
} catch (err) {
  // if any error then display message and halt process execution
  console.error("Fatal Error", err);
  process.exit(1);
}

// export the server configuration
module.exports = serverConfig;
