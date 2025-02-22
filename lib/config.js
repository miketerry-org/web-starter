// config.js:

"use strict";

// load all required packages
const confirm = require("confirm-env");
const TopSecret = require("topsecret");

// ensure the encryption key is defined inthe environment variables
confirm("ENCRYPT_KEY").hasLength(64, 64);
