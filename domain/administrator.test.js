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
    let mockIncrementDoctorPatientCount;
    let mockDecrementDoctorPatientCount;

    beforeEach(() => {
      AdminRepository.mockClear();
      mockIncrementDoctorPatientCount = jest.spyOn(AdminRepository.prototype, 'incrementDoctorPatientCount');
      mockDecrementDoctorPatientCount = jest.spyOn(AdminRepository.prototype, 'decrementDoctorPatientCount');
      jest.spyOn(AdminRepository.prototype, 'verifyAdmin');
    });

    afterEach(() => {
      mockDecrementDoctorPatientCount.mockRestore();
      mockIncrementDoctorPatientCount.mockRestore();
    });

    describe('assignPatient', () => {
      it('should call increment patient count when doctor not assign', async () => {
        const mockAssignPatient = jest
            .spyOn(AdminRepository.prototype, 'assignPatient')
            .mockImplementation(() => ({
              value: {
                patientInfo: {
                  doctorId: null,
                },
              },
            }));

        const admin = new Administrator(new UserId('123456'), new AdminRepository(''));
        const doctorId = 'doctor-1';
        const patientId = 'patient-1';
        const doctorName = 'Dr. Doe';

        await admin.assignPatient(patientId, doctorId, doctorName);

        expect(mockAssignPatient).toHaveBeenCalledTimes(1);
        expect(mockDecrementDoctorPatientCount).not.toHaveBeenCalled();
        expect(mockIncrementDoctorPatientCount).toHaveBeenCalledTimes(1);

        mockAssignPatient.mockRestore();
      });

      it('should call increment patient count for new doctor and decrement old doctor', async () => {
        const mockAssignPatient = jest
            .spyOn(AdminRepository.prototype, 'assignPatient')
            .mockImplementation(() => ({
              value: {
                patientInfo: {
                  doctorId: 'doctor-2',
                },
              },
            }));

        const admin = new Administrator(new UserId('123456'), new AdminRepository(''));
        const doctorId = 'doctor-1';
        const patientId = 'patient-1';
        const doctorName = 'Dr. Doe';

        await admin.assignPatient(patientId, doctorId, doctorName);

        expect(mockAssignPatient).toHaveBeenCalledTimes(1);
        expect(mockDecrementDoctorPatientCount).toHaveBeenCalledTimes(1);
        expect(mockIncrementDoctorPatientCount).toHaveBeenCalledTimes(1);

        mockAssignPatient.mockRestore();
      });

      it('should not call increment patient count when doctor is already assign to the doctor', async () => {
        const doctorId = 'doctor-1';
        const patientId = 'patient-1';
        const doctorName = 'Dr. Doe';
        const mockAssignPatient = jest
            .spyOn(AdminRepository.prototype, 'assignPatient')
            .mockImplementation(() => ({
              value: {
                patientInfo: {
                  doctorId: doctorId,
                },
              },
            }));

        const admin = new Administrator(new UserId('123456'), new AdminRepository(''));

        await admin.assignPatient(patientId, doctorId, doctorName);

        expect(mockAssignPatient).toHaveBeenCalledTimes(1);
        expect(mockDecrementDoctorPatientCount).not.toHaveBeenCalled();
        expect(mockIncrementDoctorPatientCount).not.toHaveBeenCalled();

        mockAssignPatient.mockRestore();
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

    describe('approve pending User', () => {
      let mockSetDefaultInfo;
      let mockApproveUser;
      beforeEach(() => {
        AdminRepository.mockClear();
        mockSetDefaultInfo = jest.spyOn(AdminRepository.prototype, 'setUserDefaultInformation');
        mockApproveUser = jest.spyOn(AdminRepository.prototype, 'approveUser');
      });

      afterEach(() => {
        mockApproveUser.mockRestore();
        mockSetDefaultInfo.mockRestore();
      });

      it('should set patient default value', async () => {
        mockApproveUser.mockReturnValueOnce({
          value: {
            userType: 'patient',
          },
        });

        const admin = new Administrator(new UserId('123456'), new AdminRepository(''));
        await admin.approvePendingUser('1234');

        expect(mockSetDefaultInfo).toHaveBeenCalledTimes(1);
        expect(mockApproveUser).toHaveBeenCalledTimes(1);
      });

      it('should set doctor default value', async () => {
        mockApproveUser.mockReturnValueOnce({
          value: {
            userType: 'doctor',
          },
        });

        const admin = new Administrator(new UserId('123456'), new AdminRepository(''));
        await admin.approvePendingUser('1234');

        expect(mockSetDefaultInfo).toHaveBeenCalledTimes(1);
        expect(mockApproveUser).toHaveBeenCalledTimes(1);
      });

      it('should not set default value for other user type', async () => {
        mockApproveUser.mockReturnValueOnce({
          value: {
            userType: 'admin',
          },
        });

        const admin = new Administrator(new UserId('123456'), new AdminRepository(''));
        await admin.approvePendingUser('1234');

        expect(mockSetDefaultInfo).toHaveBeenCalledTimes(0);
        expect(mockApproveUser).toHaveBeenCalledTimes(1);
      });
    });
  });
});
