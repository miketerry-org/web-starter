// setup.js: auth routes setup function

// load all necessary packages
const { getEnterEmailForm, postEnterEmailForm } = require("./controller");

// implement setup function to initialize authentication pages with express application
function setup(core) {
  // define route handlers using controller functions
  core.app.get("/sign-in", getEnterEmailForm);
  core.app.post("/sign-in", postEnterEmailForm);
}

// export the setup function
module.exports = { setup };
