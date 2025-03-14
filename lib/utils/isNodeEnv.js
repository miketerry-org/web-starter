// isNodeEnv.js:

"use strict";

/**
 * Checks if the current Node.js environment matches the provided mode.
 * @param {string} mode The environment to compare against (e.g., "prod", "dev", "test").
 * @returns {boolean} Returns true if the current environment matches the given mode, otherwise false.
 */
function isNodeEnv(mode) {
  let value = process.env.NODE_ENV;
  return value && value.toUpperCase() === mode.toUpperCase();
}

function isDevelopment() {
  return isNodeEnv("dev");
}

function isProduction() {
  return isNodeEnv("prod");
}

function isTesting() {
  return isNodeEnv("test");
}

// export all functions
module.exports = isNodeEnv;
