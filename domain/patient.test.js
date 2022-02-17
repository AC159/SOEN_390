const Patient = require("./patient");
const PatientStatus = require("./patient").PatientStatus;
const Address = require("./patient").Address;

describe("test value object", () => {
  describe("test PatientStatus", () => {
    test("confimred status returns name and flag", () => {
      const patientStatus = PatientStatus.Confirmed;

      expect(patientStatus.isConfirmed()).toBeTruthy();
      expect(patientStatus.isHealthy()).toBeFalsy();
      expect(patientStatus.isUnconfirmed()).toBeFalsy();
      expect(patientStatus.getStatus()).toEqual("confirmed");
    });

    test("unconfimred status returns name and flag", () => {
      const patientStatus = PatientStatus.Unconfirmed;

      expect(patientStatus.isConfirmed()).toBeFalsy();
      expect(patientStatus.isHealthy()).toBeFalsy();
      expect(patientStatus.isUnconfirmed()).toBeTruthy();
      expect(patientStatus.getStatus()).toEqual("unconfirmed");
    });

    test("healthy status returns name and flag", () => {
      const patientStatus = PatientStatus.Healthy;

      expect(patientStatus.isConfirmed()).toBeFalsy();
      expect(patientStatus.isHealthy()).toBeTruthy();
      expect(patientStatus.isUnconfirmed()).toBeFalsy();
      expect(patientStatus.getStatus()).toEqual("healthy");
    });
  });

  describe("test address", () => {
    test("address throws an error when civic number is not valid", () => {});
    test("address throws an error when street is not valid", () => {});
    test("address throws an error when postal code is not valid", () => {});
    test("address throws an error when city is not valid", () => {});
    test("address throws an error when province is not valid", () => {});

    test("license returns valid id", () => {
      const civicNumber = 1234;
      const street = "Guy Street";
      const postalCode = "L5T 3E5";
      const city = "Montreal";
      const province = "Quebec";
      const address = new Address(
        civicNumber,
        street,
        postalCode,
        city,
        province
      );

      expect(address.getCivicNumber()).toEqual(civicNumber);
      expect(address.getStreet()).toEqual(street);
      expect(address.getPostalCode()).toEqual(postalCode);
      expect(address.getCity()).toEqual(city);
      expect(address.getProvince()).toEqual(province);
      expect(address.getAddress()).toEqual(
        "1234 Guy Street, Montreal (Quebec), L5T 3E5"
      );
    });
  });
});

describe("test Patient object", () => {
  describe("Patient creation tests", () => {});

  describe("Patient method tests", () => {});
});
