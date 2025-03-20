// dates.js:

"use strict";

function isDate(value) {
  return value instanceof Date && !isNaN(value.getTime());
}

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

// export all date related functions
module.exports = { isDate, parseDate };
