const User = require("./user");
const UserId = require("./user").UserId;
const Name = require("./user").Name;
const Role = require("./user").Role;
const UserState = require("./user").UserState;

describe("test value object", () => {
  describe("test userId", () => {
    test("userId throws an error when id is not valid", () => {});

    test("userId returns valid id", () => {
      const id = "1234-12345";
      const userId = new UserId(id);

      expect(userId.getId()).toEqual(id);
    });
  });

  describe("test name", () => {
    test("firstName throws an error when not valid", () => {});
    test("lastName throws an error when not valid", () => {});

    test("Name returns valid firstName, lastName and name", () => {
      const firstName = "John";
      const lastName = "Doe";
      const userName = new Name(firstName, lastName);

      expect(userName.getFirstName()).toEqual("John");
      expect(userName.getlastName()).toEqual("Doe");
      expect(userName.getFullName()).toEqual("John Doe");
    });
  });

  describe("test role", () => {
    test("doctor role return role and flag", () => {
      const doctor = Role.Doctor;

      expect(doctor.isDoctor()).toBeTruthy();
      expect(doctor.isPatient()).toBeFalsy();
      expect(doctor.isAdministrator()).toBeFalsy();
      expect(doctor.isHealthOfficial()).toBeFalsy();
      expect(doctor.isImmigrationOfficer()).toBeFalsy();
      expect(doctor.getRole()).toEqual("doctor");
    });
    test("patient role return role and flag", () => {
      const patient = Role.Patient;

      expect(patient.isDoctor()).toBeFalsy();
      expect(patient.isPatient()).toBeTruthy();
      expect(patient.isAdministrator()).toBeFalsy();
      expect(patient.isHealthOfficial()).toBeFalsy();
      expect(patient.isImmigrationOfficer()).toBeFalsy();
      expect(patient.getRole()).toEqual("patient");
    });
    test("administrator role return role and flag", () => {
      const administrator = Role.Administrator;

      expect(administrator.isDoctor()).toBeFalsy();
      expect(administrator.isPatient()).toBeFalsy();
      expect(administrator.isAdministrator()).toBeTruthy();
      expect(administrator.isHealthOfficial()).toBeFalsy();
      expect(administrator.isImmigrationOfficer()).toBeFalsy();
      expect(administrator.getRole()).toEqual("administrator");
    });
    test("health official role return role and flag", () => {
      const healthOfficial = Role.HealthOfficial;

      expect(healthOfficial.isDoctor()).toBeFalsy();
      expect(healthOfficial.isPatient()).toBeFalsy();
      expect(healthOfficial.isAdministrator()).toBeFalsy();
      expect(healthOfficial.isHealthOfficial()).toBeTruthy();
      expect(healthOfficial.isImmigrationOfficer()).toBeFalsy();
      expect(healthOfficial.getRole()).toEqual("health official");
    });
    test("immigration officer role return role and flag", () => {
      const immigrationOfficer = Role.ImmigrationOfficer;

      expect(immigrationOfficer.isDoctor()).toBeFalsy();
      expect(immigrationOfficer.isPatient()).toBeFalsy();
      expect(immigrationOfficer.isAdministrator()).toBeFalsy();
      expect(immigrationOfficer.isHealthOfficial()).toBeFalsy();
      expect(immigrationOfficer.isImmigrationOfficer()).toBeTruthy();
      expect(immigrationOfficer.getRole()).toEqual("immigration officer");
    });
  });

  describe("test user state", () => {
    test("pending state returns role and flag", () => {
      const state = UserState.Pending;

      expect(state.isPending()).toBeTruthy();
      expect(state.isApproved()).toBeFalsy();
      expect(state.getState()).toEqual("pending");
    });
    test("approved state returns role and flag", () => {
      const state = UserState.Approved;

      expect(state.isPending()).toBeFalsy();
      expect(state.isApproved()).toBeTruthy();
      expect(state.getState()).toEqual("approved");
    });
  });
});

describe("test User object", () => {
  describe("user creation tests", () => {});

  describe("user method tests", () => {});
});
