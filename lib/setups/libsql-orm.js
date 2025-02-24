// libsql-orm:

"use strrict";

// load all required packages
const { Database } = require("libsql-orm");

// database connection function
function dbConnectFunc(dbConfig) {
  // define a new database class
  const db = new Database();

  // connect to the database
  db.connect(dbConfig.url, dbConfig.encrypt_cypher, dbConfig.encrypt_key);

  // return the newly connected database
  return db;
}

// perform all setup for database
function setup(core) {
  // assign the database connect function to all tenants
  core.tenants.dbConnectFunc = dbConnectFunc;
}

// export the setup function
module.exports = { setup };
