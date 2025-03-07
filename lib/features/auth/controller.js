// controller.js: authentication controller functions

"use strict";

// load all necessary packages
const { generateRandomCode } = require("../../utils");

// controller function to return enter email form
function getEnterEmailForm(req, res) {
  res.render("features/auth/form-enter-email");
}

function postEnterEmailForm(req, res) {
  res.render("features/auth/form-enter-code");
}

// export all controller functions
module.exports = { getEnterEmailForm, postEnterEmailForm };
