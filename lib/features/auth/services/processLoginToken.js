// processLoginToken.js: use specified token to find user, if found the finish initializing user account and permit login

"use strict";

// load all necessary modules
const path = require("path");
const core = require("../../../core");
const UserModel = require("../model.js");
const tokens = require("../../../utils/tokens.js");

// initialize the token filename used in testing
const tokenFilename = path.join(core.projectRoot, "./test/login_token.txt");

// use the token to lookup user and if found then clear token fields and return true
function processLoginToken(token) {
  // instanciate a user model instance
  const user = new UserModel(core.db);

  // if in testing mode then load the login token from the ./test folder
  if (core.isTesting) {
    token = tokens.loadFromFile(tokenFilename);
  }

  // if token is blank or unable to find token in user table then return false
  if (!token || token === "" || !user.findByToken(token)) {
    return false;
  }

  // if we get here then token was found
  return true;
}

// export function to process the login token
module.exports = processLoginToken;
