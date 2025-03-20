// check_isDuplicate.test.js:

"use strict";

// load all necessary modules
const Check = require("../lib/utils/check");

describe(`isDuplicate`, () => {
  describe(`typeof = "boolean"`, () => {
    it(`should be a duplicate`, () => {
      const data = { value1: true, value2: true };
      const checker = new Check(data).isDuplicate("value1", "value2");
      expect(checker.errors.length).toBe(0);
    });

    it(`should not be a duplicate`, () => {
      const data = { value1: true, value2: false };
      const checker = new Check(data).isDuplicate("value1", "value2");
      expect(checker.errors.length).toBe(1);
    });
  });

  describe(`typeof = "date"`, () => {
    it(`should be a duplicate`, () => {
      const data = { value1: new Date.now(), value2: new Date.now() };
      const checker = new Check(data).isDuplicate("value1", "value2");
      expect(checker.errors.length).toBe(0);
    });

    it(`should not be a duplicate`, () => {
      const data = { value1: new Date(), value2: new Date() + 1 };
      const checker = new Check(data).isDuplicate("value1", "value2");
      expect(checker.errors.length).toBe(1);
    });
  });

  describe(`typeof = "email"`, () => {
    it(`should be a duplicate`, () => {});

    it(`should not be a duplicate`, () => {});
  });

  describe(`typeof = "enum"`, () => {
    it(`should be a duplicate`, () => {});

    it(`should not be a duplicate`, () => {});
  });

  describe(`typeof = "float"`, () => {
    it(`should be a valid float`, () => {});

    it(`should not be a valid float`, () => {});
  });

  describe(`typeof = "integer"`, () => {
    it(`should be a duplicate`, () => {});

    it(`should not be a duplicate`, () => {});
  });

  describe(`typeof = "string"`, () => {
    it(`should be a duplicate`, () => {});

    it(`should not be a duplicate`, () => {});
  });
});
