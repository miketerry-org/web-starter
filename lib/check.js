// check.js:

/**
 * This file is unfinished
 *
 * @todo finish implementing the isDate method to handle parsing strings into dates
 * @todo isFloat needs to convert strings to float
 * @todo isInteger needs to convert string to integer
 * @todo implement isTime
 * @todo implement isTimestamp
 * @todo Add unit tests for entire module
 * @todo Improve error handling for missing required fields in the `Check` class.
 */

"use strict";

// Default configuration values for password validation
const defaultPasswordConfig = {
  minLength: 12,
  maxLength: 100,
  minUppercase: 1,
  minLowercase: 1,
  minDigits: 1,
  minSymbols: 1,
};

/**
 * Returns a regular expression to validate passwords based on configuration values.
 * @param {Object} config - Configuration object for password validation.
 * @returns {RegExp} - The regex pattern for validating the password.
 */
function getPasswordRegEx(config) {
  const minLength = config.minLength;
  const maxLength = config.maxLength;
  const minUppercase = config.minUppercase;
  const minLowercase = config.minLowercase;
  const minDigits = config.minDigits;
  const minSymbols = config.minSymbols;

  const uppercase = `(?=.*[A-Z]{${minUppercase},})`; // At least 'minUppercase' uppercase letters
  const lowercase = `(?=.*[a-z]{${minLowercase},})`; // At least 'minLowercase' lowercase letters
  const digits = `(?=.*\d{${minDigits},})`; // At least 'minDigits' digits
  const symbols = `(?=.*[!@#$%^&*()_+=[\\]{};':"\\\\|,.<>/?-]{${minSymbols},})`; // At least 'minSymbols' special characters

  const regExPattern = `^${uppercase}${lowercase}${digits}${symbols}.{${minLength},${maxLength}}$`;

  return new RegExp(regExPattern);
}

/**
 * Capitalizes the first letter of each word in the string and makes the rest lowercase.
 * @param {string} str - The string to convert to title case.
 * @returns {string} - The string with each word's first letter capitalized.
 */
function titleCase(str) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Capitalizes the first letter of the string and makes the rest lowercase.
 * @param {string} str - The string to convert to first case.
 * @returns {string} - The string with the first letter capitalized and the rest in lowercase.
 */
function firstCase(str) {
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Class to check the validity of various data types and values.
 */
class Check {
  #data = [];
  #errors = [];

  /**
   * Constructor for Check class.
   * @param {Object} data - The data to be validated.
   */
  constructor(data) {
    this.#data = data;
  }

  /**
   * Verifies that the value is a boolean.
   * @param {string} name - The name of the field.
   * @param {boolean} defaultValue - The default value of the field.
   * @param {boolean} required - Whether the field is required.
   * @returns {Check} - The Check instance for method chaining.
   */
  isBoolean(name, defaultValue, required = true) {
    let value = this._getValue(name, defaultValue, required);

    if (value && this._checkType(name, value, "boolean")) {
    }

    return this;
  }

  /**
   * Verifies that the value is a valid date.
   * @param {string} name - The name of the field.
   * @param {Date} defaultValue - The default value of the field.
   * @param {boolean} required - Whether the field is required.
   * @returns {Check} - The Check instance for method chaining.
   */
  isDate(name, defaultValue, required = true) {
    let value = this._getValue(name, defaultValue, required);

    if (value && this._checkType(name, value, "date")) {
    }

    return this;
  }

  /**
   * Verifies that two values are equal.
   * @param {string} name - The name of the field.
   * @param {string} duplicateName - The name of the duplicate field to compare.
   * @param {boolean} required - Whether the field is required.
   * @returns {Check} - The Check instance for method chaining.
   */
  isDuplicate(name, duplicateName, required = true) {
    let value1 = this._getValue(name, undefined, required);
    if (value1) {
      let value2 = this._getValue(duplicateName, undefined, required);
      if (value1 !== value2) {
        this.#errors.push(`"${duplicateName}" and "${name}" do not match`);
      }
    }

    return this;
  }

  /**
   * Verifies that the value is a valid email.
   * @param {string} name - The name of the field.
   * @param {string} defaultValue - The default value of the field.
   * @param {boolean} required - Whether the field is required.
   * @returns {Check} - The Check instance for method chaining.
   */
  isEmail(name, defaultValue, required = true) {
    let value = this._getValue(name, defaultValue, required);

    if (value && this._checkType(name, value, "string")) {
      const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!regex.test(value)) {
        this.#errors.push(`"${name} is not a valid email`);
      }
    }

    return this;
  }

  /**
   * Verifies that the value is a valid enumeration.
   * @param {string} name - The name of the field.
   * @param {string} defaultValue - The default value of the field.
   * @param {Array<string>} values - The valid enumeration values.
   * @param {boolean} required - Whether the field is required.
   * @returns {Check} - The Check instance for method chaining.
   */
  isEnum(name, defaultValue, values, required = true) {
    let value = this._getValue(name, defaultValue, required);

    if (value && this._checkType(name, value, "string")) {
      if (!values.find((item) => item.toLowerCase() === value.toLowerCase())) {
        this.#errors.push(`${name} is "${value}" which is not a valid value`);
      }
    }

    return this;
  }

  /**
   * Verifies that the value is a valid float.
   * @param {string} name - The name of the field.
   * @param {string} defaultValue - The default value of the field.
   * @param {number} minFloat - The minimum allowed float value.
   * @param {number} maxFloat - The maximum allowed float value.
   * @param {boolean} required - Whether the field is required.
   * @returns {Check} - The Check instance for method chaining.
   */
  isFloat(name, defaultValue, minFloat, maxFloat, required = true) {
    let value = this._getValue(name, defaultValue, required);

    if (value && typeof value === "string") {
      value = parseFloat(value);
      if (!isNaN(value)) {
        this.#data[name] = value;
      }
    }

    if (value && this._checkType(name, value, "number")) {
      if (minFloat && minFloat > value) {
        this.#errors.push(`"${name}" cannot be less than "${minFloat}"`);
      } else if (maxFloat && maxFloat < value) {
        this.#errors.push(`"${name}" cannot be greater than "${maxFloat}"`);
      }
    }

    return this;
  }

  /**
   * Verifies that the value is an integer.
   * @param {string} name - The name of the field.
   * @param {string} defaultValue - The default value of the field.
   * @param {number} minInteger - The minimum allowed integer value.
   * @param {number} maxInteger - The maximum allowed integer value.
   * @param {boolean} required - Whether the field is required.
   * @returns {Check} - The Check instance for method chaining.
   */
  isInteger(name, defaultValue, minInteger, maxInteger, required = true) {
    let value = this._getValue(name, defaultValue, required);

    if (value && typeof value === "string") {
      value = parseInt(value, 10);
      if (!isNaN(value)) {
        this.#data[name] = value;
      }
    }

    if (value && this._checkType(name, value, "number")) {
      if (minInteger && minInteger > value) {
        this.#errors.push(`"${name}" cannot be less than "${minInteger}"`);
      } else if (maxInteger && maxInteger < value) {
        this.#errors.push(`"${name}" cannot be greater than "${maxInteger}"`);
      }
    }

    return this;
  }

  /**
   * Verifies that the value is a valid password.
   * @param {string} name - The name of the field.
   * @param {Object} config - Configuration for password validation.
   * @param {boolean} required - Whether the field is required.
   * @returns {Check} - The Check instance for method chaining.
   */
  isPassword(name, config = {}, required = true) {
    let value = this._getValue(name, undefined, required);

    if (value && this._checkType(name, value, "string")) {
      const mergedConfig = { ...defaultPasswordConfig, ...config };
      let regEx = getPasswordRegEx(mergedConfig);

      if (!regEx.test(value)) {
        this.#errors.push(`"${name}" is not a valid password value`);
      }
    }

    return this;
  }

  /**
   * Verifies that the value matches a given regular expression.
   * @param {string} name - The name of the field.
   * @param {string} defaultValue - The default value of the field.
   * @param {RegExp} regEx - The regular expression to test against.
   * @param {boolean} required - Whether the field is required.
   * @returns {Check} - The Check instance for method chaining.
   */
  isRegEx(name, defaultValue, regEx, required = true) {
    let value = this._getValue(name, defaultValue, required);

    if (value && this._checkType(name, value, "string")) {
      if (!regEx.test(value)) {
        this.#errors.push(`"${name}" is "${value}" which is not a valid value`);
      }
    }

    return this;
  }

  /**
   * Verifies that the value is a valid string with optional length and capitalization constraints.
   * @param {string} name - The name of the field.
   * @param {string} defaultValue - The default value of the field.
   * @param {number} minLength - The minimum length of the string.
   * @param {number} maxLength - The maximum length of the string.
   * @param {string} capitalization - The capitalization rule (e.g., "upper", "lower", "title", "first").
   * @param {boolean} required - Whether the field is required.
   * @returns {Check} - The Check instance for method chaining.
   */
  isString(
    name,
    defaultValue,
    minLength,
    maxLength,
    capitalization = undefined,
    required = true
  ) {
    let value = this._getValue(name, defaultValue, required);

    if (value && this._checkType(name, value, "string")) {
      let len = value.length;

      if (minLength && minLength > len) {
        this.#errors.push(`"${name}" must be at least ${minLength} characters`);
      } else if (maxLength && maxLength < len) {
        this.#errors.push(
          `"${name}" must be no more than ${maxLength} characters`
        );
      }

      if (capitalization) {
        if (capitalization === "upper") {
          this.#data[name] = value.toUpperCase();
        } else if (capitalization === "lower") {
          this.#data[name] = value.toLowerCase();
        } else if (capitalization === "title") {
          this.#data[name] = titleCase(value);
        } else if (capitalization === "first") {
          this.#data[name] = firstCase(value);
        } else {
          throw new Error(
            `"${name}" cannot be converted to "${capitalization}" because it is not a valid form of capitalization`
          );
        }
      }
    }

    return this;
  }

  /**
   * Returns an array of error messages.
   * @returns {Array<string>} - The list of error messages.
   */
  get errors() {
    return this.#errors;
  }

  /**
   * Checks if the data type of the value is as expected.
   * @param {string} name - The name of the field.
   * @param {*} value - The value to check.
   * @param {string} expectedType - The expected type.
   * @returns {boolean} - True if the types match, false otherwise.
   */
  _checkType(name, value, expectedType) {
    let actualType = typeof value;
    let same = expectedType === actualType;
    if (!same) {
      this.#errors.push(
        `"${name}" is of type "${actualType}" but should be of type "${expectedType}"`
      );
    }

    return same;
  }

  /**
   * Returns the value of the field or a default value if it doesn't exist.
   * @param {string} name - The name of the field.
   * @param {*} defaultValue - The default value to return if the field is missing.
   * @param {boolean} required - Whether the field is required.
   * @returns {*} - The field value or the default value.
   */
  _getValue(name, defaultValue, required) {
    let value = this.#data[name];

    if (!value) {
      if (!defaultValue && required) {
        this.#errors.push(`"${name} field is required.`);
      } else {
        value = defaultValue;
      }
    }

    return value;
  }
}

module.exports = Check;
