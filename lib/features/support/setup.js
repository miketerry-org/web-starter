// setup.js: contact page setup function

// load all necessary packages
const { getSupportPage } = require("./controller");

// implement setup function to initialize support page with express application
function setup(core) {
  core.app.get("/support", getSupportPage);
}

// export the setup function
module.exports = { setup };
