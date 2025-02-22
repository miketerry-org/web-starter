// core.js:

"use strict";

// load all necessary packages
const fs = require("fs");
const path = require("path");

/**
 * Logs a fatal error and terminates the process.
 * @param {Error|string} err The error object or error message to be logged.
 */
function fatalError(err) {
  console.error("Fatal", err);
  process.exit(1);
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

/**
 * Checks if the current Node.js environment matches the provided mode.
 * @param {string} mode The environment to compare against (e.g., "prod", "dev", "test").
 * @returns {boolean} Returns true if the current environment matches the given mode, otherwise false.
 */
function isNodeEnv(mode) {
  let value = process.env.NODE_ENV;
  return value && value.toUpperCase() === mode.toUpperCase();
}

class Core {
  #app = null;
  #emailer = null;
  #services = {};
  #tenants = null;

  /**
   * Gets the Express application instance.
   * @returns {Object} The Express app instance.
   * @throws {Error} Throws an error if the app is not initialized.
   */
  get app() {
    if (this.#app) {
      return this.#app;
    } else {
      fatalError(
        `The "core.app" property must be assigned an express application`
      );
    }
  }

  /**
   * Sets the Express application instance.
   * @param {Object} value The Express app instance to assign.
   */
  set app(value) {
    this.#app = value;
  }

  /**
   * Gets the emailer (Nodemailer) instance.
   * @returns {Object} The Nodemailer instance.
   * @throws {Error} Throws an error if the emailer is not initialized.
   */
  get emailer() {
    if (this.#emailer) {
      return this.#emailer;
    } else {
      fatalError(`The "core.emailer" property must be assigned an nodemailer`);
    }
  }

  /**
   * Sets the emailer (Nodemailer) instance.
   * @param {Object} value The Nodemailer instance to assign.
   */
  set emailer(value) {
    this.#emailer = value;
  }

  /**
   * Gets the registered services.
   * @returns {Object} The object containing all the services.
   */
  get services() {
    return this.#services;
  }

  /**
   * Adds a service method to the services collection.
   * @param {string} serviceName The name of the service.
   * @param {Function} method The method to add to the service.
   * @throws {Error} Throws an error if the provided method is not a function or does not have a name.
   */
  addServiceMethod(serviceName, method) {
    if (typeof method !== "function") {
      fatalError(`The provided service method must be a function.`);
    }

    // Check if the function has a name
    if (!method.name) {
      fatalError(`The provided function must have a name.`);
    }

    // Ensure the service namespace exists
    if (!this.#services[serviceName]) {
      this.#services[serviceName] = {};
    }

    // Add the method to the service object
    this.#services[serviceName][method.name] = method;
  }

  /**
   * Gets the tenants instance.
   * @returns {Object} The tenants instance.
   * @throws {Error} Throws an error if the tenants instance is not initialized.
   */
  get tenants() {
    if (this.#tenants) {
      return this.#tenants;
    } else {
      fatalError(
        `The "Core.tenants" property must be assigned an instance of the "Tenants" class.`
      );
    }
  }

  /**
   * Sets the tenants instance.
   * @param {Object} value The tenants instance to assign.
   */
  set tenants(value) {
    this.#tenants = value;
  }

  /**
   * Checks if the current Node environment is development.
   * @returns {boolean} Returns true if the environment is "dev".
   */
  get isDevelopment() {
    return isNodeEnv("dev");
  }

  /**
   * Checks if the current Node environment is production.
   * @returns {boolean} Returns true if the environment is "prod".
   */
  get isProduction() {
    return isNodeEnv("prod");
  }

  /**
   * Checks if the current Node environment is testing.
   * @returns {boolean} Returns true if the environment is "test".
   */
  get isTesting() {
    return isNodeEnv("test");
  }

  /**
   * Sets up modules by requiring and calling their setup method if it exists.
   * @param {string[]} [moduleNames=[]] An array of module names to setup.
   * @throws {Error} Throws an error if a module setup fails.
   */
  setupModules(moduleNames = []) {
    moduleNames.forEach((moduleName) => {
      try {
        // load the specified module as we were in the main application
        let module = require.main.require(moduleName);

        // determine if module has setup function
        let hasSetup =
          module &&
          typeof module === "object" &&
          typeof module.setup === "function";

        // if there is a setup method then call it
        if (hasSetup) {
          module.setup(this);
        }
      } catch (err) {
        fatalError(err.message);
      }
    });
  }
}

/** @type {Core} */
const core = new Core();

// Export the global core instance
module.exports = core;
