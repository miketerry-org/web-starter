"use strict";

// load all necessary modules
const config = require("../../lib/utils/config");
const createLogger = require("../../lib/utils/createLogger");

async function run() {
  try {
    const logger = await createLogger(config.logConfig, true); // Await the createLogger function
    logger.info("hello world Mike"); // Use the logger to log a message
  } catch (err) {
    console.error(err.message);
  }
}

run(); // Call the async function
