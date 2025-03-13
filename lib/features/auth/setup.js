// setup.js: auth routes setup function

// load all necessary packages
const { rules } = require("confirm-json");
const { getEnterEmailForm, postEnterEmailForm } = require("./controller");

// implement setup function to initialize authentication pages with express application
function setup(core) {
  // define rule to ensure email address passed to sign-in form
  rules.add("postEmailForm", ["email,string,required,,30,80"]);

  // define route handlers using controller functions
  core.app.get("/sign-in", getEnterEmailForm);

  core.app.post(
    "/sign-in",
    rules.middleware("postEmailForm"),
    postEnterEmailForm
  );
}

// export the setup function
module.exports = { setup };
