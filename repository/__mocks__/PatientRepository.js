
const fetchPatientForm = jest.fn(() => [{_id: '123456789', patientUid: 'abcdef', doctorUid: 'asdfgg'}]);
const fetchPatientsCovidInfo = jest.fn(() => [{name: 'John Doe', patientUid: 'abcdef', covidStatus: 'negative'}]);
const updateStatusForm = jest.fn();
const addStatusForm = jest.fn();
const raiseFlag = jest.fn();

const mockPatientRepository = jest.fn().mockImplementation(() => {
  return {fetchPatientForm, updateStatusForm, addStatusForm, raiseFlag, fetchPatientsCovidInfo};
});

module.exports = mockPatientRepository;
