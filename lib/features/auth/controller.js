// controller.js: authentication controller functions

"use strict";

// load all necessary packages
const { generateRandomCode } = require("../../utils");
const Check = require("../../check");

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

function postEnterEmailForm(req, res) {
  // perform body validation and merge locals into data
  let data = verifyEmailForm(req.body, res.locals);
  console.log("data", data);
  console.log(data.errors.length);

  // if no errors in body properties then render next form
  if (data.errors.length === 0) {
    res.render("features/auth/form-enter-code", data);
  } else {
    //!!mike
    res.status(403).send("invalid email");
  }
}

// export all controller functions
module.exports = { getEnterEmailForm, postEnterEmailForm };
