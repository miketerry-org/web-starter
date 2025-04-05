// serverConfig.test.js:

// very first action is to load encryption key from private environment variable file
require("dotenv").config("../.env");

// load all necessary modules
const serverConfig = require("../lib/serverConfig");

console.log("hello world");
