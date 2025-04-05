// test-logger.js:

"use strict";

// load environment variables from .env
require("dotenv").config();

// load all necessary modules
const config = require("../lib/utils/config");
const createLogger = require("../lib/utils/createLogger");

// the first tenant is the testing one
let tenant = config.tenants[0];

// create the testing logger
const logger = createLogger(tenant);

// export the logger instance
module.exports = logger;
