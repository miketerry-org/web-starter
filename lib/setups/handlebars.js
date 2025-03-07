// handlebars.js: module to setup handlebars template engine with express application

"use strict";

// load all necessary packages
const express = require("express");
const exphbs = require("express-handlebars");

// setup the application with the handlebars view engine
function setup(core) {
  // Configure handlebars with custom directories
  const hbs = exphbs.create({
    defaultLayout: core.paths.defaultLayout,
    layoutsDir: core.paths.layouts,
    partialsDir: core.paths.partials,
    extname: "hbs",
  });

  // Set up the engine
  core.app.engine("hbs", hbs.engine);
  core.app.set("view engine", "hbs");
  core.app.set("views", core.paths.views);

  // if in production mode then cashe all compiled templates
  if (core.isProduction) {
    core.app.enable("view cache");
  }
}

// export the function to setup handlebars view engine
module.exports = { setup };
