// check_isDate.test.js:

"use strict";

// load all necessary modules
const Check = require("../lib/utils/check");

describe(`isDate`, () => {
  describe(`Date object`, () => {
    it(`should be a valid Date object`, () => {
      const dob = new Date("1945-01-23");
      let data = { dob };
      let checker = new Check(data);
      checker.isDate("dob", undefined);
      expect(checker.errors.length).toBe(0);
      expect(data.dob).toBe(dob);
    });

    it(`should be an invalid Date object`, () => {
      let data = { dob: new Date("1945-01-32") };
      let checker = new Check(data);
      checker.isDate("dob", undefined);
      expect(checker.errors.length).toBe(1);
    });
  });
});
