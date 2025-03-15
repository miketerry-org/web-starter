// processEnterEmailForm.js:

"use strict";

// load all required modules
const Check = require("../../../utils/check");
const AuthModel = require("../model");

function verifyEmailForm(body, locals) {
  // verify the email is in the body and is valid
  let errors = new Check(body).isEmail("email", undefined, true).errors;

  // return the merging of body, locals and errors
  return { ...locals, ...body, errors };
}

async function processEnterEmailForm(db, body, locals) {
  // declare local variables
  let auth = null;
  let data = null;
  let template = null;

  // perform body validation and merge locals into data
  data = verifyEmailForm(body, locals);

  // if one or more errors in body properties then proceed
  if (data.errors.length > 0) {
    template = "features/auth/form-enter-email";
    return { data, template };
  }

  // initialize AutModel for tenant database
  const Auth = AuthModel(db);

  try {
    // Check if the email already exists in the database
    auth = await Auth.findOne({ email: data.email });

    // if record not found then create new record
    if (!auth) {
      auth = new Auth({ email: data.email });
    }

    // Generate verification code, assign it internally to auth instance and return it inside data
    data.code = auth.createVerificationCode();

    // Save the user's record with the generated code
    await auth.save();

    // if no error then template is enter code form
    template = "features/auth/form-enter-code";
  } catch (err) {
    data.errors.push(err.message);
    template = "features/auth/form-enter-email";
  }

  console.log("auth", auth); // auth will always be defined here
  console.log("data", data); // sanitize or remove before production

  // return data and template
  return { data, template };
}

// export the processEnterEmailForm function
module.exports = processEnterEmailForm;
