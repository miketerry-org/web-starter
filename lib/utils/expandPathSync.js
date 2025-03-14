// pathExistsSync.js:

"use strict";

// load all necessary packages
const fs = require("fs");

function pathExistsSync(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
}

// export existsPathSync function
module.exports = pathExistsSync;
