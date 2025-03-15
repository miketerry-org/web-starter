// controller.js:

"use strict";

// load all necessary packages
const generateRandomCode = require("../../utils/generateRandomCode");
const Check = require("../../utils/check");
const AuthModel = require("./model");
const mongoose = require("mongoose"); // Import mongoose to interact with databases

// controller function to return enter email form
function getEnterEmailForm(req, res) {
  res.render("features/auth/form-enter-email");
}

function verifyEmailForm(body, locals) {
  // verify the email is in the body and is valid
  let errors = new Check(body).isEmail("email", undefined, true).errors;

  // merge the body properties into the locals
  let data = { ...locals, ...body };

  // return array of errors as part of data
  data.errors = errors;

  // return the data
  return data;
}

async function processEnterEmailForm(db, body, locals) {
  // perform body validation and merge locals into data
  let data = verifyEmailForm(body, locals);

  // if no errors in body properties then proceed
  if (data.errors.length === 0) {
    // initialize AutModel for tenant database
    const Auth = AuthModel(db);

    // Initialize auth outside of try block
    let auth = null;
    try {
      // Check if the email already exists in the database
      auth = await Auth.findOne({ email: data.email });

      // if record not found then create new record
      if (!auth) {
        auth = new Auth({ email: data.email });
      }

      // Generate verification code, assign it internally to auth instance and return it as function result
      data.code = auth.createVerificationCode();

      // Save the user's record with the generated code
      await auth.save();

      // if no error then status is 200
      data.status = 200;
    } catch (err) {
      data.errors.push(err.message); // Push error message
      data.status = 500;
    }

    console.log("auth", auth); // auth will always be defined here
    console.log("data", data); // sanitize or remove before production
  } else {
    // If there are errors in the email, respond with a 403
    data.status = 403;
  }

  // return the data object with status, email, code and array of any errors
  return data;
}

// process the enter email form
async function postEnterEmailForm(req, res) {
  // call service method to process the email for step 1 of authentication
  let data = await processEnterEmailForm(req.db, req.body, res.locals); // Await the result

  // if no error
  if (data.errors.length === 0) {
    res.render("features/auth/form-enter-code", data);

    // if one or more errors then re-render the enter email form
  } else {
    res.status(data.status).render("features/auth/form-enter-email", data);
  }
}

// export all controller functions
module.exports = { getEnterEmailForm, postEnterEmailForm };
