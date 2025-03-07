// core.js:

"use strict";

// load all necessary packages
const fs = require("fs");
const path = require("path");
const Tenants = require("express-tenants");
const config = require("./config");
const { fatalError, isNodeEnv } = require("./utils");

class Core {
  #app = null;
  #mailer = null;
  #services = {};
  #server = null;
  #paths = null;
  #tenants = null;

  /**
   * Creates an instance of the Core class.
   * @param {Object} config Configuration object for the core.
   * @param {Object} config.server Server configuration.
   * @param {Object} config.paths Paths configuration.
   * @param {Array} config.tenants List of tenant configurations.
   */
  constructor(config) {
    this.#server = { ...config.server };
    this.#paths = { ...config.paths };
    this.#tenants = new Tenants();
    this.#tenants.addList(config.tenants);
  }

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
   * Gets the mailer instance.
   * @returns {Object} The mailer instance.
   * @throws {Error} Throws an error if the mailer is not initialized.
   */
  get mailer() {
    if (this.#mailer) {
      return this.#mailer;
    } else {
      fatalError(
        `The "core.mailer" property must be assigned a node mailer instance`
      );
    }
  }

  /**
   * Sets the node mailer instance.
   * @param {Object} value The node mailer instance to assign.
   */
  set mailer(value) {
    this.#mailer = value;
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
   * Gets the paths configuration.
   * @returns {Object} The paths configuration.
   */
  get paths() {
    return this.#paths;
  }

  /**
   * Gets the server configuration.
   * @returns {Object} The server configuration.
   */
  get server() {
    return this.#server;
  }

  /**
   * Gets the tenants instance.
   * @returns {Object} The tenants instance.
   */
  get tenants() {
    return this.#tenants;
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
const core = new Core(config);

// Export the global core instance
module.exports = core;
