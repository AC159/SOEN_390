const Doctor = require("./doctor");
const License = require("./doctor").License;

describe("test value object", () => {
  describe("test license", () => {
    test("license throws an error when license id is not valid", () => {});

    test("license returns valid id", () => {
      const id = "1234-12345";
      const license = new License(id);

      expect(license.getLicense()).toEqual(id);
    });
  });
});

describe("test Doctor object", () => {
  describe("doctor creation tests", () => {});

  describe("doctor method tests", () => {});
});
