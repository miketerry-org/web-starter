// setup.js: home page setup function for core

"use strict";

// load all necessary packages
const { getHomePage } = require("./controller");

// implement setup function to initialize home page with express application
function setup(core) {
  core.app.get("/", getHomePage);
}

// export the setup function used by @zyx/core
module.exports = { setup };
