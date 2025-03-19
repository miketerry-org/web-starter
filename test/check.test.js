// check.test.js:

"use strict";

// load all required modules
const Check = require("../lib/utils/check");

describe("isBoolean", () => {
  describe('typeof = "boolean"', () => {
    it("should be type boolean and be true", () => {
      let data = { active: true };
      let checker = new Check(data);
      checker.isBoolean("active", undefined);
      expect(checker.errors.length).toBe(0);
      expect(data.active).toBe(true);
    });

    it("should be boolean type and be false", () => {
      let data = { active: false };
      let checker = new Check(data);
      checker.isBoolean("active", undefined);
      expect(checker.errors.length).toBe(0);
      expect(data.active).toBe(false);
    });
  });

  describe(`typeof = "string"`, () => {
    it(`should be string "true" and converted to boolean true`, () => {
      let data = { active: "true" };
      let checker = new Check(data);
      checker.isBoolean("active", undefined);
      expect(checker.errors.length).toBe(0);
      expect(data.active).toBe(true);
    });

    it(`should be string "false" and converted to boolean false`, () => {
      let data = { active: "false" };
      let checker = new Check(data);
      checker.isBoolean("active", undefined);
      expect(checker.errors.length).toBe(0);
      expect(data.active).toBe(false);
    });

    it(`should be string "T" and converted to boolean true`, () => {
      let data = { active: "T" };
      let checker = new Check(data);
      checker.isBoolean("active", undefined);
      console.clear();
      console.log("errors", checker.errors);
      expect(checker.errors.length).toBe(0);
      expect(data.active).toBe(true);
    });

    it(`should be string "F" and converted to boolean false`, () => {
      let data = { active: "F" };
      let checker = new Check(data);
      checker.isBoolean("active", undefined);
      expect(checker.errors.length).toBe(0);
      expect(data.active).toBe(false);
    });
  });
});

describe("isString", () => {
  describe("capitalization", () => {
    it("should be first letter capital for each word", () => {
      const data = { firstname: "donald mallard" };
      let checker = new Check(data);
      checker.isString("firstname", undefined, 1, 20, "title");
      expect(checker.errors.length).toBe(0);
      expect(data.firstname).toBe("Donald Mallard");
    });

    it("should be capital for first word", () => {
      const data = { lastname: "duck" };
      let checker = new Check(data);
      checker.isString("lastname", undefined, 1, 20, "first");
      expect(checker.errors.length).toBe(0);
      expect(data.lastname).toBe("Duck");
    });

    it("should be all uppercase letters", () => {
      const data = { lastname: "duck" };
      let checker = new Check(data);
      checker.isString("lastname", undefined, 1, 20, "upper");
      expect(checker.errors.length).toBe(0);
      expect(data.lastname).toBe("DUCK");
    });

    it("should be all lower case letters", () => {
      const data = { lastname: "DUCK" };
      let checker = new Check(data);
      checker.isString("lastname", undefined, 1, 20, "lower");
      expect(checker.errors.length).toBe(0);
      expect(data.lastname).toBe("duck");
    });
  });

  describe("required", () => {
    it("is required", () => {
      const data = { lastname: "donald mallard" };
      let checker = new Check(data);
      checker.isString("firstname", undefined, 1, 10, "title");
      expect(checker.errors.length).toBe(1);
    });

    it("is not required", () => {
      const data = { lastname: "donald mallard" };
      let checker = new Check(data);
      checker.isString("firstname", undefined, 1, 10, "title");
      expect(checker.errors.length).toBe(1);
    });
  });

  describe("default value", () => {
    it("should use default", () => {
      const data = { lastname: "donald mallard" };
      let checker = new Check(data);
      checker.isString("firstname", "Daisy", 1, 10, "title");
      expect(checker.errors.length).toBe(0);
      expect(data.firstname).toBe("Daisy");
    });
  });

  describe("minLength & maxLength", () => {
    it("should have length of 5 or more", () => {
      const data = { lastname: "DUCK" };
      let checker = new Check(data);
      checker.isString("lastname", undefined, 5, 20, "lower");
      expect(checker.errors.length).toBe(1);
    });

    it("should have length of 10 or less", () => {
      const data = { lastname: "donald mallard" };
      let checker = new Check(data);
      checker.isString("lastname", undefined, 1, 10, "title");
      expect(checker.errors.length).toBe(1);
    });
  });
});
