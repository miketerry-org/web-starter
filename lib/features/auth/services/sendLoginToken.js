// sendLoginToken.js: create login token, save in user table and send login email

"use strict";

// load all necessary modules
const path = require("path");
const core = require("../../../core");
const UserModel = require("../model.js");
const tokens = require("../../../utils/tokens.js");

// initialize the token filename used in testing
const tokenFilename = path.join(core.projectRoot, "./test/login_token.txt");

// initialize the email message object
function createMessage(to, token) {
  return {
    from: process.env.SMTP_FROM,
    to,
    subject: `${process.env.PROJECT_TITLE} Login Link`,
    html: `
<!DOCTYPE HTML>
<HTML>
<BODY>
<h1>Login Link</h1>
<p></p>
<p>Click the link below to finish logging in to ${process.env.PROJECT_TITLE} web site.</p>
<p><a href="${process.env.PROJECT_URL}/token/${token}">Click Me!</a></p>
</body>
</html>
`,
  };
}

// create login token, save in user table and send login email
function sendLoginToken(email) {
  // instanciate a user model
  let user = new UserModel(core.db);

  // if email is not in database then insert new user
  if (!user.findByEmail(email)) {
    user.email = email;
    user.active = false;
    user.role = "guest";
    user.insert();
  }

  // initialize all login token columns and update the user record
  user.token = tokens.generate();
  user.token_expires_at = tokens.ExpiresAt();
  user.token_used = false;
  user.update();

  // if in testing mode then save the login token in the ./test folder
  if (core.isTesting) {
    tokens.saveToFile(tokenFilename, user.token);
  }

  // now send the user an email with a login link including the token
  return core.emailer.send(createMessage(user.email, user.token));
}

// export function to perform login step 1
module.exports = sendLoginToken;
