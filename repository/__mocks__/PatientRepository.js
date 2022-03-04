
const fetchPatientStatusForms = jest.fn(() => [{_id: '123456789', patientUid: 'abcdef', doctorUid: 'asdfgg'}]);
const fetchPatientsCovidInfo = jest.fn(() => [{name: 'John Doe', patientUid: 'abcdef', covidStatus: 'negative'}]);
const updateStatusForm = jest.fn();
const addStatusForm = jest.fn();
const addContactTracingReport = jest.fn();
const raiseFlag = jest.fn();

const verifyOfficial = jest.fn(() => true);

const mockPatientRepository = jest.fn().mockImplementation(() => {
  return {fetchPatientStatusForms, updateStatusForm, addStatusForm, raiseFlag, fetchPatientsCovidInfo, verifyOfficial, addContactTracingReport};
});

module.exports = mockPatientRepository;
