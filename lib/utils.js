// utils.js:

"use strict";

// load all necessary packages
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

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

/**
 * Generates a cryptographically secure random code with the specified number of digits, returned as a string.
 *
 * @param {number} digits - The number of digits in the random code.
 * @returns {string} A cryptographically secure random code with the specified number of digits, formatted as a string.
 * @throws {Error} Will throw an error if the digits parameter is less than 1.
 */
function generateRandomCode(digits = 4) {
  if (digits < 1) {
    throw new Error("Number of digits must be at least 1");
  }

  // Calculate the min and max values for the range of the code
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;

  // Generate a random number in the specified range
  const code = crypto.randomInt(min, max + 1);

  // Return the code as a string, padded with leading zeros if necessary
  return code.toString().padStart(digits, "0");
}

// export all utility functions
module.exports = {
  fatalError,
  findProjectRoot,
  expandPath,
  pathExistsSync,
  isNodeEnv,
  generateRandomCode,
};
