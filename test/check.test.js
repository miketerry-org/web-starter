// check.test.js:

"use strict";

// load all required modules
const Check = require("./check");

const userRoles = ["Guest", "Subscriber", "admin"];

const data = {
  firstname: "donald mallard",
  lastname: "DUCK",
  email: "donald.duck@disney.com",
  password: "aBcd-1234",
  password2: "aBcd-1234",
  active: true,
  dob: new Date("1965/07/03"),
  time: 12 * 60 * 60 * 1000,
  timestamp: Date.now(),
  role: "Guest",
  age: 30,
  rating: 4.5,
  authCode: "1234",
};

function checkUser(user) {
  return new Check(user)
    .isString("firstname", undefined, 1, 20, "title")
    .isString("lastname", "Mouse", 1, 20, "first")
    .isEmail("email")
    .isPassword("password", { minLength: 8 })
    .isDuplicate("password2", "password")
    .isBoolean("active", undefined)
    .isEnum("role", "Guest", userRoles)
    .isInteger("age", undefined, 18, 64)
    .isFloat("rating", 1, 1, 5)
    .isRegEx("authCode", undefined, /^\d{4}$/);
}

const results = checkUser(data);
console.log("data", data);
console.log("results", results.errors);
