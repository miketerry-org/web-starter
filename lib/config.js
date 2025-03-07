// config.js:

"use strict";

// load all required packages
const path = require("path");
const confirm = require("confirm-env");
const TopSecret = require("topsecret");
const { fatalError, expandPath } = require("./utils");

// ensure the encryption key is defined inthe environment variables
confirm("ENCRYPT_KEY").hasLength(64, 64);

// global configuration object
let config = undefined;
try {
  // the "config.secure" file is in the project root
  const filename = expandPath("config.secure");

  // create an instance of the TopSecret encrypt/decrypt class
  const secret = new TopSecret();

  // assign the encryption key stored in the environment variables
  secret.key = process.env.ENCRYPT_KEY;

  // load and decrypt the configuration json object
  config = secret.decryptJSONFromFile(filename);

  // fully expand all config.paths
  config.paths.static = expandPath(config.paths.static);
  config.paths.views = expandPath(config.paths.views);
  config.paths.layouts = expandPath(config.paths.layouts);
  config.paths.partials = expandPath(config.paths.partials);
} catch (err) {
  // if any error then unsafe to continue  with program execution
  fatalError(err.message);
}

// export the cconfiguration object
module.exports = config;
