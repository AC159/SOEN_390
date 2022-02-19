const AdminRepository = require('../repository/AdminRepository');
const Administrator = require('./administrator');
const {UserId} = require('./user');

jest.mock('../repository/AdminRepository');

describe('test value object', () => {});

describe('test Administrator object', () => {
  beforeEach(() => {
    AdminRepository.mockClear();
  });

  describe('Administrator creation tests', () => {
    test('test empty administrator', () => {});
  });

  describe('Administrator method tests', () => {
    beforeEach(() => {
      AdminRepository.mockClear();
    });

    describe('assignPatient', () => {
      it('should call increment patient count when doctor not assign', async () => {
        const mockAssignPatient = jest
            .spyOn(AdminRepository.prototype, 'assignPatient')
            .mockImplementation(() => ({
              value: {
                patientInfo: {
                  doctor: null,
                },
              },
            }));
        const mockIncrementDoctorPatientCount = jest.spyOn(AdminRepository.prototype, 'incrementDoctorPatientCount');
        jest.spyOn(AdminRepository.prototype, 'verifyAdmin');

        const admin = new Administrator(new UserId('123456'), new AdminRepository(''));
        const doctorId = 'doctor-1';
        const patientId = 'patient-1';

        await admin.assignPatient(patientId, doctorId);

        expect(mockAssignPatient).toHaveBeenCalledTimes(1);
        expect(mockIncrementDoctorPatientCount).toHaveBeenCalledTimes(1);

        mockAssignPatient.mockRestore();
        mockIncrementDoctorPatientCount.mockRestore();
      });

      it('should not call increment patient count when doctor is already assign to the doctor', async () => {
        const doctorId = 'doctor-1';
        const patientId = 'patient-1';
        const mockAssignPatient = jest
            .spyOn(AdminRepository.prototype, 'assignPatient')
            .mockImplementation(() => ({
              value: {
                patientInfo: {
                  doctor: doctorId,
                },
              },
            }));
        const mockIncrementDoctorPatientCount = jest.spyOn(AdminRepository.prototype, 'incrementDoctorPatientCount');
        jest.spyOn(AdminRepository.prototype, 'verifyAdmin');

        const admin = new Administrator(new UserId('123456'), new AdminRepository(''));

        await admin.assignPatient(patientId, doctorId);

        expect(mockAssignPatient).toHaveBeenCalledTimes(1);
        expect(mockIncrementDoctorPatientCount).not.toHaveBeenCalled();

        mockAssignPatient.mockRestore();
        mockIncrementDoctorPatientCount.mockRestore();
      });
    });

    describe('fetch doctor profile', () => {
      beforeEach(() => {
        AdminRepository.mockClear();
        jest.spyOn(AdminRepository.prototype, 'fetchDoctors')
            .mockImplementation(() => {
              return [
                {
                  'uid': 'doctor-1',
                  'name': 'John Doe',
                  'address': '1234 street',
                  'doctorInfo': {
                    'patientCount': 2,
                  },
                }];
            });
      });

      it('should format the doctors information', async () => {
        const admin = new Administrator(new UserId('123456'), new AdminRepository(''));

        const response = await admin.fetchDoctorProfiles();

        expect(response[0].uid).toBe('doctor-1');
        expect(response[0].name).toBe('John Doe');
        expect(response[0].address).toBe('1234 street');
        expect(response[0].patientCount).toBe(2);
      });
    });
  });
});
