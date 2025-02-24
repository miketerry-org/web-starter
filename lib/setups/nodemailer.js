// nodemailer.js:

"use strict";

// Load necessary modules
const nodemailer = require("nodemailer");

/**
 * Global nodemailer transport instance.
 * @private
 * @type {Object|null}
 */
let _transport = null;

/**
 * Callback function invoked when an email finishes sending.
 * Logs any errors or logs the email info if in development mode.
 *
 * @param {Error|null} err - The error that occurred, or null if successful.
 * @param {Object} info - Information about the sent email.
 * @returns {boolean} Returns true if email was sent successfully, false otherwise.
 */
function sendEmailCallBack(err, info) {
  // Log any error
  if (err) {
    console.error("SendEmail Error:", err);
  } else if (core.isDevelopment) {
    // If in development mode, display email message info
    console.info("Email sent:", info);
  }

  // Return true if no error, false if there was an error
  return !err;
}

/**
 * Creates and returns an emailer object with the send functionality.
 * Initializes nodemailer SMTP transport if not already done.
 *
 * @param {Object} core - The core object containing configuration for nodemailer.
 * @returns {Object} The emailer object with a `send` method.
 */
function createEmailer(core) {
  // If transport is not already created, initialize it
  if (!_transport) {
    _transport = nodemailer.createTransport({
      host: core.smtp.host,
      port: 465,
      secure: true, // Use SSL/TLS
      auth: {
        user: core.secure.username,
        pass: core.smtp.password,
      },
      tls: {
        rejectUnauthorized: false, // Allow self-signed certs (adjust based on your needs)
      },
    });
  }

  // Return the emailer object with a `send` method
  return {
    /**
     * Sends an email message using the created transport.
     *
     * @param {Object} message - The email message object to send.
     */
    send: (message) => {
      console.debug("Sending email message:", message);
      _transport.sendMail(message, sendEmailCallBack);
    },
  };
}

/**
 * Sets up the emailer on the provided core object.
 * Initializes nodemailer with the provided configuration.
 *
 * @param {Object} core - The core object to bind the emailer to.
 */
function setup(core) {
  // Check that required properties exist on the core object
  if (!core.smtp || !core.secure) {
    throw new Error("Missing required SMTP or secure configuration in core.");
  }

  // Create and bind the emailer to the core object
  core.Emailer = createEmailer(core);
}

// Export the setup function
module.exports = { setup };
