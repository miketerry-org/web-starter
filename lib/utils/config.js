// config.js:

"use strict";

// load all required packages
const path = require("path");
const confirm = require("confirm-env");
const TopSecret = require("topsecret");
const fatalError = require("./fatalError");
const expandPath = require("./expandPath");
const Check = require("./check");

// halt the program if the encryption key is not defined inthe environment variables
confirm("ENCRYPT_KEY").hasLength(64, 64);

// function to load the encrypted configuration file
function loadConfigFile(filename) {
  // the "config.secure" file is in the project root
  filename = expandPath(filename);

  // create an instance of the TopSecret encrypt/decrypt class
  const secret = new TopSecret();

  // assign the encryption key stored in the environment variables
  secret.key = process.env.ENCRYPT_KEY;

  // load and decrypt the configuration json object
  let config = secret.decryptJSONFromFile(filename);

  // now retur nthe decrypted and validated global configuration object
  return config;
}

function checkLocals(errors, locals) {
  errors.push(
    ...new Check(locals)
      .isString("site_title", undefined, 1, 255)
      .isString("site_slogan", undefined, 1, 255)
      .isString("site_owner", undefined, 1, 255)
      .isInteger("site_copyright", undefined)
      .isString("site_host", undefined, 1, 255)
      .isString("support_email", undefined, 1, 255)
      .isString("support_email", undefined, 1, 255).errors
  );
}

function checkLogging(errors, logging) {
  errors.push(
    ...new Check(logging)
      //      .isString("database_url", undefined, 1, 255)
      .isString("collectionName", undefined, 1, 255)
      .isBoolean("capped", true)
      .isInteger("maxSize", 10)
      .isInteger("maxDocs", 10000, 1000, 1000000).errors
  );
}

function checkPaths(errors, paths) {
  errors.push(
    ...new Check(paths)
      .isString("static", "public", 1, 255)
      .isString("views", "views", 1, 255)
      .isString("layouts", "views/layouts", 1, 255)
      .isString("partials", "views/partials", 1, 255)
      .isString("defaultLayout", "layout", 1, 255).errors
  );
}

function checkRateLimit(errors, rateLimit) {
  errors.push(
    ...new Check(rateLimit)
      .isInteger("minutes", 10, 5, 60)
      .isInteger("requests", 200, 10, 1000).errors
  );
}

function checkSession(errors, session) {
  errors.push(
    ...new Check(session)
      .isString("database_url", undefined, 1, 255)
      .isString("collectionName", undefined, 1, 255)
      .isString("secret", undefined, 1, 255)
      .isInteger("timeout", 30, 10, 24 * 60).errors
  );
}

function checkServer(errors, server) {
  // check the server properties which are not in nested objects
  errors.push(
    ...new Check(server).isInteger("port", undefined, 1000, 60000).errors
  );

  // check session, rate limit, paths and logging configuration values
  checkPaths(errors, server.paths);
  checkSession(errors, server.session);
  checkRateLimit(errors, server.rateLimit);
  checkLogging(errors, server.logging);
}

function checkSMTP(errors, smtp) {
  errors.push(
    ...new Check(smtp)
      .isString("host", undefined, 1, 255)
      .isString("username", undefined, 1, 255)
      .isPassword("password")
      .isString("sender", undefined, 1, 255).errors
  );
}

function checktenant(errors, tenant) {
  errors.push(
    ...new Check(tenant)
      .isInteger("tenant_id", undefined, 1, 1000)
      .isInteger("node_id", undefined, 1, 1000)
      .isString("hostname", undefined, 1, 255)
      .isString("database_url", undefined, 1, 255).errors
  );

  checkLocals(errors, tenant.locals);
  checkLogging(errors, tenant.logging);
  checkSMTP(errors, tenant.smtp);
}

function checkTenants(errors, tenants) {
  tenants.forEach((tenant) => {
    checktenant(errors, tenant);
  });
}

function checkConfig(config) {
  let errors = [];
  checkServer(errors, config.server);
  checkTenants(errors, config.tenants);
  return errors;
}

// initialize the global variable for the global configuration
const config = loadConfigFile("config.secure");

// perform validation of all configuration values
let errors = checkConfig(config);

// halt program if one or more errors in configuration
if (errors.length > 0) {
  console.error("Configuration Errors");
  console.error(errors);
  process.exit(1);
}

// return the global configuration object
module.exports = config;
