

const fetchPatientForms = jest.fn((userId) => {
    return { _id: "123456789", patientUid: "abcdef", doctorUid: "asdfgg"};
});

fetchPatientForms.toArray = jest.fn(() => ({ toArray: obj => [obj] }));

const updateStatusForm = jest.fn();
const addStatusForm = jest.fn();

const mockPatientRepository = jest.fn().mockImplementation(() => {
    return { fetchPatientForms: fetchPatientForms, updateStatusForm: updateStatusForm, addStatusForm: addStatusForm };
});

module.exports = mockPatientRepository;
