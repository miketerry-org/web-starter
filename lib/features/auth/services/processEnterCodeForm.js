"use strict";

// load all required modules
const core = require("../../../core");
const Check = require("../../../utils/check");
const AuthModel = require("../model");

/**
 * Verifies the format of the verification code in the request body.
 *
 * @param {Object} body - The request body containing the form data.
 * @param {Object} locals - The locals object for the current request.
 * @returns {Object} - An object containing the merged locals, body, and errors.
 */
function verifyCodeForm(body, locals) {
  // Regular expression for 3 digits + hyphen + 3 digits
  const pattern = /^[0-9]{3}-[0-9]{3}$/;

  // Verify the code is in the body and is valid
  let errors = new Check(body).isRegEx("code", undefined, pattern, true).errors;

  // if development mode then log code to console
  if (core.isDevelopment) {
    console.log("verification code", body.code);
  }

  // Return the merged locals, body and errors
  return { ...locals, ...body, errors };
}

/**
 * Processes the form where the user enters the verification code.
 * Validates the code and handles the authentication process.
 *
 * @param {Object} db - The database connection object.
 * @param {Object} body - The request body containing the form data.
 * @param {Object} locals - The locals object for the current request.
 * @returns {Promise<Object>} - An object containing the data, errors, and template to render.
 */
async function processEnterCodeForm(db, body, locals) {
  // initialize local variables
  let auth = null;
  let data = null;
  let template = null;

  try {
    // Step 1: Validate the code format using the helper function
    data = verifyCodeForm(body, locals);
    console.log("validate", data);

    // re-render entry code form if one or more errors found in body
    if (data.errors.length > 0) {
      template = "features/auth/form-enter-code";
      return { data, template };
    }

    // Step 2: Initialize the Auth model for the tenant database
    const Auth = AuthModel(db);

    // Step 3: Retrieve the auth record based on the email passed
    auth = await Auth.findOne({ email: data.email });

    // Handle the case where the auth record doesn't exist
    if (!auth) {
      data.errors.push("No authentication record found for this email.");
      template = "features/auth/form-enter-email";
      return { data, template };
    }

    // Step 4: Increment login attempts and check if the account is locked
    await auth.incrementLoginAttempts();

    // Step 5: Try to verify the code using the AuthModel's verifyCode method
    await Auth.verifyCode(data.email, data.code);

    console.log("afterSignIn", auth);

    // If no errors, render dashboard
    template = "features/dashboard/index";
  } catch (err) {
    console.log("err", err);
    console.log("data-a", data);
    if (err.message === "User not found") {
      data.errors.push(
        "No authentication record found for this email.  Please re-enter the email"
      );
      template = "features/auth/form-enter-email";
    } else if (err.message === "Invalid verification code") {
      data.errors.push("The verification code you entered is incorrect.");
      template = "features/auth/form-enter-code";
    } else if (err.message === "Verification code has expired") {
      data.errors.push(
        "The verification code has expired. Please request a new code by signing in again."
      );
      template = "features/auth/form-enter-email";
    } else if (err.message === "Email already verified") {
      data.errors.push("This email is already verified.");
      template = "features/dashboard/index";
    } else if (
      err.message === "Account is temporarily locked. Please try again later."
    ) {
      data.errors.push(
        "Your account is temporarily locked due to multiple failed login attempts."
      );
      template = "features/auth/account-temporarily-locked";
    } else {
      console.log("bad", data);
      // Catch any other unexpected errors and set template to unknown error
      data.errors.push(err.message);
      template = "unexpected-error";
    }
  }

  // Return data, errors and template
  return { data, template };
}

// export the processEnterCodeForm function
module.exports = processEnterCodeForm;
