// dates.js:

"use strict";

/**
 * Checks if the provided value is a valid Date object.
 * @param {*} value - The value to check.
 * @returns {boolean} - Returns true if the value is a valid Date object, false otherwise.
 */
function isDate(value) {
  return value instanceof Date && !isNaN(value.getTime());
}

/**
 * Parses a value into a Date object.
 * If the value is already a Date, it returns the Date object.
 * If the value is a string, it attempts to convert it to a Date.
 * If the value is of any other type or the string cannot be parsed, it returns NaN.
 *
 * @param {*} value - The value to parse.
 * @returns {Date|NaN} - Returns a Date object if the value is a valid date or string, or NaN if parsing fails.
 */
function parseDate(value) {
  // if value is not a date
  if (!isDate(value)) {
    // if value is a string then attempt to parse it
    if (typeof value === "string") {
      value = new Date(value);

      // if parsing fails then return NaN
      if (!isDate(value)) {
        value = NaN;
      }
    } else {
      // for all other data types return NaN
      value = NaN;
    }
  }

  // return the converted value
  return value;
}

/**
 * Returns a Date object representing today's date with the time set to midnight.
 *
 * @returns {Date} - A Date object for today, with time set to midnight.
 */
function today() {
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Set time to midnight
  return now;
}

/**
 * Returns a Date object representing tomorrow's date with the time set to midnight.
 *
 * @returns {Date} - A Date object for tomorrow, with time set to midnight.
 */
function tomorrow() {
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Set time to midnight
  now.setDate(now.getDate() + 1); // Add one day to the current date
  return now;
}

/**
 * Returns a Date object representing yesterday's date with the time set to midnight.
 *
 * @returns {Date} - A Date object for yesterday, with time set to midnight.
 */
function yesterday() {
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Set time to midnight
  now.setDate(now.getDate() - 1); // Subtract one day from the current date
  return now;
}

// Export all date related functions
module.exports = { isDate, parseDate, today, tomorrow, yesterday };
