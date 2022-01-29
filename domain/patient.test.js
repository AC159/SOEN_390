const Patient = require('./patient');
const PatientStatus = require('./patient').PatientStatus;

describe('test value object', () => {
  describe('test PatientStatus', () => {
    test('confimred status returns name and flag', () => {
      const patientStatus = PatientStatus.Confirmed;

      expect(patientStatus.isConfirmed()).toBeTruthy();
      expect(patientStatus.isHealthy()).toBeFalsy();
      expect(patientStatus.isUnconfirmed()).toBeFalsy();
      expect(patientStatus.getStatus()).toEqual("confirmed");
    });

    test('unconfimred status returns name and flag', () => {
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
})

describe('test Patient object', () => {
  describe('Patient creation tests', () => {

  })

  describe('Patient method tests', () => {
    
  })
})