
const fetchPatientStatusForms = jest.fn(() => [{_id: '123456789', patientUid: 'abcdef', doctorUid: 'asdfgg'}]);

const updateStatusForm = jest.fn();
const addStatusForm = jest.fn();

const mockPatientRepository = jest.fn().mockImplementation(() => {
  return {fetchPatientStatusForms: fetchPatientStatusForms, updateStatusForm: updateStatusForm, addStatusForm: addStatusForm};
});

module.exports = mockPatientRepository;
