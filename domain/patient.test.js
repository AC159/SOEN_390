const Patient = require('./patient');
const PatientStatus = require('./patient').PatientStatus;
const Address = require('./patient').Address;
const {UserId, Name} = require("./user");
const PatientRepository = require("../repository/PatientRepository");
jest.mock('../repository/PatientRepository');


describe('test Patient API for status forms', () => {

  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    PatientRepository.mockClear();
  });


  test('GET /patient/get-status-forms/patientABC',  async () => {
      const formData = {
          "patientUid": "FtycBsOtoYSCjDoBkhVXAcb13Uu2",
          "doctorUid": "TEQ6pJE6NBdXAtJ6ze1KbTuMnye2",
          "temperature": "39",
          "fever": "yes",
          "headache": "no",
          "breathing issues": "no",
          "fatigue": "yes"
      };
      const userId = new UserId("Patient Id");
      const name = new Name("Patient", "One");
      const civicNumber = 1234;
      const street = "Guy Street";
      const postalCode = "L5T 3E5";
      const city = "Montreal";
      const province = "Quebec";
      const address = new Address(civicNumber, street, postalCode, city, province);

      const patientRepository = new PatientRepository();
      console.log(patientRepository.fetchPatientForms(1234));
      const patient = new Patient(userId, name, address, "4501234569", "1998-01-01", PatientStatus.Confirmed, true, patientRepository);
      await patient.postStatusForm();
      await patient.updateStatusForm();
      expect(PatientRepository).toHaveBeenCalledTimes(1);
      expect(patientRepository.fetchPatientForms.mock.calls.length).toBe(1);
  })

  // describe('Patient method tests', () => {})
})


describe('test value object', () => {
  describe('test PatientStatus', () => {
    test('confirmed status returns name and flag', () => {
      const patientStatus = PatientStatus.Confirmed;

      expect(patientStatus.isConfirmed()).toBeTruthy();
      expect(patientStatus.isHealthy()).toBeFalsy();
      expect(patientStatus.isUnconfirmed()).toBeFalsy();
      expect(patientStatus.getStatus()).toEqual("confirmed");
    });

    test('unconfirmed status returns name and flag', () => {
      const patientStatus = PatientStatus.Unconfirmed;

      expect(patientStatus.isConfirmed()).toBeFalsy();
      expect(patientStatus.isHealthy()).toBeFalsy();
      expect(patientStatus.isUnconfirmed()).toBeTruthy();
      expect(patientStatus.getStatus()).toEqual("unconfirmed");
    });

    test('healthy status returns name and flag', () => {
      const patientStatus = PatientStatus.Healthy;

      expect(patientStatus.isConfirmed()).toBeFalsy();
      expect(patientStatus.isHealthy()).toBeTruthy();
      expect(patientStatus.isUnconfirmed()).toBeFalsy();
      expect(patientStatus.getStatus()).toEqual("healthy");
    });
  })

  describe('test address', () => {
    test('address throws an error when civic number is not valid', () => {})
    test('address throws an error when street is not valid', () => {})
    test('address throws an error when postal code is not valid', () => {})
    test('address throws an error when city is not valid', () => {})
    test('address throws an error when province is not valid', () => {})

    test('license returns valid id', () => {
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
      )
    })
  })
})
