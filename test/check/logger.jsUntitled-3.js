// logger.js:

"use strict";

// load all necesssary modules
const createLogger = require("../../lib/utils/createLogger");

const dbURL =
  "mongodb+srv://doadmin:cU71603Gd42p9WTg@mongodb-94b1cb07.mongo.ondigitalocean.com/web-starter-test?tls=true&authSource=admin&replicaSet=mongodb";
const collection = "logs";

const logger = createLogger(dbURL, collection);

// export the logger instance
module.exports = logger;
