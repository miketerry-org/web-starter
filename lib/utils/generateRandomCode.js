// generateRandomCode.js:

"use strict";

// load all necessary packages
const crypto = require("crypto");

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

// export generateRandomCode function
module.exports = generateRandomCode;
