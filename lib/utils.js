// utils.js:

"use strict";

// load all necessary packages
const path = require("path");
const fs = require("fs");

/**
 * Logs a fatal error and terminates the process.
 * @param {Error|string} err The error object or error message to be logged.
 */
function fatalError(err) {
  console.error("Fatal", err);
  process.exit(1);
}

/**
 * Checks if the current Node.js environment matches the provided mode.
 * @param {string} mode The environment to compare against (e.g., "prod", "dev", "test").
 * @returns {boolean} Returns true if the current environment matches the given mode, otherwise false.
 */
function isNodeEnv(mode) {
  let value = process.env.NODE_ENV;
  return value && value.toUpperCase() === mode.toUpperCase();
}

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

// Check if path exists synchronously
function pathExistsSync(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
}

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

// export all utility functions
module.exports = {
  fatalError,
  findProjectRoot,
  expandPath,
  pathExistsSync,
  isNodeEnv,
};
