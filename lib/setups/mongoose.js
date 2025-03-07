// mongoose.js:
//
// "use strict";

// Load required packages
const mongoose = require("mongoose");

// Database connection function for Mongoose
function dbConnectFunc(dbConfig) {
  return mongoose.createConnection(dbConfig.url, dbConfig.options);
}

// Perform all setup for database connections
function setup(core) {
  // Assign the database connection function to all tenants
  core.tenants.dbConnectFunc = dbConnectFunc;

  // Connect to all tenant databases during setup phase
  core.tenants.list.forEach((tenant) => {
    // connect to the database
    const connection = tenant.db;

    // Handle connection events
    connection.on("connected", () => {
      console.info(`Connected To "${connection.name}`);
    });

    connection.on("error", (err) => {
      console.error(`Error connecting to "${connection.name}"`, err);
    });

    connection.on("disconnected", () => {
      console.log(`Disconnected from "${connection.name}`);
    });
  });
}

// Export the setup function
module.exports = { setup };
