
const fetchPatientForm = jest.fn(() => [{_id: '123456789', patientUid: 'abcdef', doctorUid: 'asdfgg'}]);
const updateStatusForm = jest.fn();
const addStatusForm = jest.fn();
const raiseFlag = jest.fn();

const mockPatientRepository = jest.fn().mockImplementation(() => {
  return {fetchPatientForm, updateStatusForm, addStatusForm, raiseFlag};
});

module.exports = mockPatientRepository;
