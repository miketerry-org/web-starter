// expandPath.js
//
// "use strict";

// load all necessary packages
const fs = require("fs");
const path = require("path");
const findProjectRoot = require("./findProjectRoot");
const pathExistsSync = require("./expandPathSync");

function expandPath(value, required = true) {
  if (!path.isAbsolute(value)) {
    value = path.join(findProjectRoot("package.json"), value);
  }

  // if path must exist, but it is not found then throw  fatal error
  if (required && !pathExistsSync(value)) {
    fatalError(`Path not found! "{$value}`);
  }

  // return the expanded path
  return value;
}

// export the expandPath function
module.exports = expandPath;
