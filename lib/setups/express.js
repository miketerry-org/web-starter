// express.js:
//
// "use strict";

// load all module dependencies
const path = require("path");
const fs = require("fs");
const express = require("express");
const compression = require("compression");
const morgan = require("morgan");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const helmet = require("helmet");
const { xss } = require("express-xss-sanitizer");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const MongoDBStore = require("connect-mongodb-session")(session);

// perform all configuration for the global application
function setup(core) {
  // perform initial creation of express application
  const app = express();

  // first middleware assigns global core object to request
  app.use((req, res, next) => {
    req.core = core;
    next();
  });

  // second middleware finds the tenant class
  app.use(core.tenants.middleware);

  // compress all responses
  app.use(compression());

  // assign Body parser for both JSON and urlencoded form data
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // assign Cookie parser
  app.use(cookieParser());

  // initialize MongoDB session store
  const store = new MongoDBStore({
    uri: core.server.sessionUrL, // MongoDB URI from the core config
    collection: "sessions", // the collection where sessions will be stored
  });

  // define error handler for session load/save errors
  store.on("error", function (error) {
    console.error("MongoDB Session Error: ", error);
  });

  // initialize and assign session store with MongoDB
  app.use(
    session({
      secret: core.server.sessionSecret,
      resave: false,
      saveUninitialized: false,
      store: store, // use the MongoDB store
      cookie: {
        secure: core.isProduction, // use secure cookies in production
        httpOnly: true, // prevent JS from accessing cookies
        maxAge: core.server.sessionTimeout * 60000, // session timeout in ms
        sameSite: "Lax", // prevent CSRF attacks
      },
    })
  );

  // add Development logging middleware
  if (core.isDevelopment) {
    app.use(morgan("dev"));
  }

  // assign File uploading
  app.use(fileupload());

  // assign security headers
  app.use(helmet()); // Add security headers (e.g., CSP, XSS protection)

  // Prevent XSS attacks
  app.use(xss());

  // assign Rate limiting
  app.use(
    rateLimit({
      windowMs: core.server.rateLimitMS,
      max: core.server.rateLimitMax,
    })
  );

  // Prevent HTTP param pollution
  app.use(hpp());

  // Enable CORS
  app.use(cors());

  // Serve static assets from the "public" directory
  app.use(
    express.static(core.paths.static, {
      maxAge: "1y", // Cache static assets for 1 year
      etag: true, // Enable ETag for conditional requests
    })
  );

  // middleware to set layout based on HTMX request
  app.use((req, res, next) => {
    res.locals.layout = req.get("HX-Request") ? false : "layout";
    next();
  });

  // bind the fully initialized express application to the core module
  core.app = app;
}

// export the setup function as property of object
module.exports = { setup };
