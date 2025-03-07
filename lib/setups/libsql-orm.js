// libsql-orm:

"use strrict";

// load all required packages
const { Database } = require("libsql-orm");

// database connection function
function dbConnectFunc(dbConfig) {
  const { url, encryptionCypher, encryptionKey } = dbConfig;
  let db = new Database(url, { encryptionCypher, encryptionKey });
  return db;
}

// perform all setup for database
function setup(core) {
  // assign the database connect function to all tenants
  core.tenants.dbConnectFunc = dbConnectFunc;

  // connect to all database during setup phase
  core.tenants.list.forEach((tenant) => {
    tenant.connect();
  });
}

// export the setup function
module.exports = { setup };
