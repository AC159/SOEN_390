
const fetchPatientForms = jest.fn(() => {
    return { toArray: _ => [{_id: "123456789", patientUid: "abcdef", doctorUid: "asdfgg"}]};
});

const updateStatusForm = jest.fn();
const addStatusForm = jest.fn();

const mockPatientRepository = jest.fn().mockImplementation(() => {
    return { fetchPatientForms: fetchPatientForms, updateStatusForm: updateStatusForm, addStatusForm: addStatusForm };
});

module.exports = mockPatientRepository;
