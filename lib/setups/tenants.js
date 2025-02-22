// tenants.js:

"use strrict";

// load all required packages
const path = require("path");
consTenants = require("express-tenants");
const { Database } = require("libsql-orm");

function dbConnect(config) {
  let url = config.url;
  let options = {};
  return new Database(url, options);
}

// perform all setup for database
function setup(core) {
  console.clear();
  console.log("here");

  // create the filename for the tenants.json configuration data
  const filename = path.join(core.projectRoot, "data/tenants.json");
  console.log("filename", filename);
  console.log("tenants-secret-key", process.env.TENANTS_SECRET_KEY);

  /*
  try {
    // initialize the tenants  configuration manager
    const tenants = new Tenants(dbConnect);

    // load the tenants from the json file
    tenants.loadFromFile(filename);

    console.log("tenants.length", tenants.length);
  } catch (err) {
    core.fatal(err.message);
  }
    /*
}

//!!mike
const core = require("./core")

// export the setup function
module.exports = { setup };
