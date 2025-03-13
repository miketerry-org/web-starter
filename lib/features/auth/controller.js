// controller.js: authentication controller functions

"use strict";

// load all necessary packages
const { generateRandomCode } = require("../../utils");
const { rules } = require("confirm-json");

// controller function to return enter email form
function getEnterEmailForm(req, res) {
  res.render("features/auth/form-enter-email");
}

function postEnterEmailForm(req, res) {
  console.log("posting email");
  console.log("req.errors", req.errors);
  console.log("req.body", req.body);
  let errors = rules.validate("postEmailForm", req.body);
  console.log("errors", errors);

  // if validation middleware found no errors in request body
  if (req.errors.length === 0) {
    res.render("features/auth/form-enter-code");
  } else {
    //!!mike
    res.send("invalid email");
  }
}

// export all controller functions
module.exports = { getEnterEmailForm, postEnterEmailForm };
