const Patient = require('./patient');
const PatientStatus = require('./patient').PatientStatus;
const Address = require('./patient').Address;
const {UserId, Name} = require('./user');
const PatientRepository = require('../repository/PatientRepository');
jest.mock('../repository/PatientRepository');


describe('test Patient status forms creation, update and retrieval', () => {
  const userId = new UserId('Patient Id');
  const name = new Name('Patient', 'One');
  const civicNumber = 1234;
  const street = 'Guy Street';
  const postalCode = 'L5T 3E5';
  const city = 'Montreal';
  const province = 'Quebec';
  const address = new Address(civicNumber, street, postalCode, city, province);

  test('GET /patient/get-status-forms/patientABC', async () => {
    const patientRepository = new PatientRepository();
    const patient = new Patient(userId, name, address, '4501234569', '1998-01-01', PatientStatus.Confirmed, true, patientRepository);
    await patient.getPatientStatusForms();
    expect(patientRepository.fetchPatientStatusForms).toHaveBeenCalledTimes(1);
  });

  test('POST /update-status-form/patientABC', async () => {
    const patientRepository = new PatientRepository();
    const patient = new Patient(userId, name, address, '4501234569', '1998-01-01', PatientStatus.Confirmed, true, patientRepository);
    await patient.updateStatusForm();
    expect(patientRepository.updateStatusForm).toHaveBeenCalledTimes(1);
  });

  test('POST /submit-status-form', async () => {
    const patientRepository = new PatientRepository();
    const patient = new Patient(userId, name, address, '4501234569', '1998-01-01', PatientStatus.Confirmed, true, patientRepository);
    await patient.postStatusForm();
    expect(patientRepository.addStatusForm).toHaveBeenCalledTimes(1);
  });
});


describe('test value object', () => {
  describe('test PatientStatus', () => {
    test('confirmed status returns name and flag', () => {
      const patientStatus = PatientStatus.Confirmed;

      expect(patientStatus.isConfirmed()).toBeTruthy();
      expect(patientStatus.isHealthy()).toBeFalsy();
      expect(patientStatus.isUnconfirmed()).toBeFalsy();
      expect(patientStatus.getStatus()).toEqual('confirmed');
    });

    test('unconfirmed status returns name and flag', () => {
      const patientStatus = PatientStatus.Unconfirmed;

      expect(patientStatus.isConfirmed()).toBeFalsy();
      expect(patientStatus.isHealthy()).toBeFalsy();
      expect(patientStatus.isUnconfirmed()).toBeTruthy();
      expect(patientStatus.getStatus()).toEqual('unconfirmed');
    });

    test('healthy status returns name and flag', () => {
      const patientStatus = PatientStatus.Healthy;

      expect(patientStatus.isConfirmed()).toBeFalsy();
      expect(patientStatus.isHealthy()).toBeTruthy();
      expect(patientStatus.isUnconfirmed()).toBeFalsy();
      expect(patientStatus.getStatus()).toEqual('healthy');
    });
  });

  describe('test address', () => {
    test('address throws an error when civic number is not valid', () => {});
    test('address throws an error when street is not valid', () => {});
    test('address throws an error when postal code is not valid', () => {});
    test('address throws an error when city is not valid', () => {});
    test('address throws an error when province is not valid', () => {});

    test('license returns valid id', () => {
      const civicNumber = 1234;
      const street = 'Guy Street';
      const postalCode = 'L5T 3E5';
      const city = 'Montreal';
      const province = 'Quebec';
      const address = new Address(
          civicNumber,
          street,
          postalCode,
          city,
          province,
      );

      expect(address.getCivicNumber()).toEqual(civicNumber);
      expect(address.getStreet()).toEqual(street);
      expect(address.getPostalCode()).toEqual(postalCode);
      expect(address.getCity()).toEqual(city);
      expect(address.getProvince()).toEqual(province);
      expect(address.getAddress()).toEqual(
          '1234 Guy Street, Montreal (Quebec), L5T 3E5',
      );
    });
  });
});

describe('test Patient object', () => {
  describe('Patient creation tests', () => {});

  describe('Patient method tests', () => {});
});
