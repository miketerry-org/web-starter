// createLogger.js:
//
// "use strict";

// Load necessary packages
const Check = require("./check");
const winston = require("winston");
require("winston-mongodb"); // This is necessary to use the MongoDB transport

// Function to create the logger instance
async function createLogger(config, recreateCollection = false) {
  // Validate the configuration properties
  const check = new Check(config);
  check
    .isString("databaseURL", undefined, 1, 255)
    .isString("collectionName", "logs", 1, 255)
    .isInteger("expirationDays", undefined, 1, 365, false)
    .isBoolean("capped", undefined, false)
    .isInteger("maxSize", undefined, 1, 1000, false) // Max size for capped collections
    .isInteger("maxDocs", undefined, 1000, 1000000, false); // Max docs for capped collections

  // If any errors then throw exception
  if (check.errors.length > 0) {
    throw new Error(check.errors.join("\n"));
  }

  // Destructure the tenant log config object with default values for optional properties
  const {
    databaseURL,
    collectionName,
    expirationDays = undefined,
    capped = false,
    maxSize = undefined,
    maxDocs = undefined,
  } = config;

  // Create MongoDB client
  const MongoClient = require("mongodb").MongoClient;
  const client = await MongoClient.connect(databaseURL);
  const db = client.db();

  const collectionObj = db.collection(collectionName);

  // Optionally force recreation of the collection
  if (recreateCollection) {
    // Drop the collection if it exists (ignore error if it doesn't exist)
    try {
      await collectionObj.drop();
    } catch (err) {
      if (err.codeName !== "NamespaceNotFound") {
        console.error("Error dropping collection:", err);
      }
    }
  }

  // Check for conflicting options: cannot use both capped and TTL options
  if (capped && expirationDays) {
    throw new Error(
      "Cannot use both capped and TTL options for the same collection."
    );
  }

  // If capped collection properties are specified
  if (capped && maxSize && maxDocs) {
    // Create a capped collection if the properties are provided
    await db.createCollection(collectionName, {
      capped: true,
      size: maxSize * 1024 * 1024, // Max size converted from MB to bytes
      max: maxDocs, // Limit to a maximum number of documents
    });
  }
  // If no capped collection config, check for TTL index
  else if (expirationDays) {
    // Create a TTL index on the specified field (default is 'timestamp')
    await collectionObj.createIndex(
      { timestamp: 1 }, // Create index on 'timestamp' field
      { expireAfterSeconds: expirationDays * 24 * 60 * 60 } // Expire documents after specified days
    );
  }
  // If neither capped nor TTL config is provided, just create a standard collection
  else {
    await db.createCollection(collectionName);
  }

  // Create the logger instance
  const logger = winston.createLogger({
    level: "info", // Set default logging level
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      // Console transport for logging to the console
      new winston.transports.Console({
        format: winston.format.simple(),
      }),
      // MongoDB transport to log to MongoDB
      new winston.transports.MongoDB({
        db: databaseURL,
        collection: collectionName,
        level: "info", // Minimum level to log into MongoDB (can be adjusted)
        options: {},
      }),
    ],
  });

  return logger;
}

// Export the create logger function
module.exports = createLogger;
