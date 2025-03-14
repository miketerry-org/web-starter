// findProjectRoot.js:

"use strict";

// load all necessary packages
const fs = require("fs");
const path = require("path");

/**
 * Finds the root directory of the project by searching for a specific marker file (e.g., package.json).
 * @param {string} [markerFile="package.json"] The name of the marker file to search for.
 * @returns {string|null} The path to the project root directory or null if not found.
 */
function findProjectRoot(markerFile = "package.json") {
  let currentDir = process.cwd();

  while (currentDir !== path.parse(currentDir).root) {
    const markerPath = path.join(currentDir, markerFile);
    if (fs.existsSync(markerPath)) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }

  // marker file not found so unable to find project root
  return null;
}

// export findProjectRoot function
module.exports = findProjectRoot;
