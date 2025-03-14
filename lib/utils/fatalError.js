// fatalError.js:

"use strict";

/**
 * Logs a fatal error and terminates the process.
 * @param {Error|string} err The error object or error message to be logged.
 */
function fatalError(err) {
  console.error("Fatal", err);
  process.exit(1);
}

// export the fatal error function
module.exports = fatalError;
