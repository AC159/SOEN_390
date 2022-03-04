const License = require('./doctor').License;
const DoctorRepository = require('../repository/DoctorRepository');
const Doctor = require('./doctor');
const {UserId} = require('./user');

jest.mock('../repository/DoctorRepository');

describe('test value object', () => {
  describe('test license', () => {
    test('license throws an error when license id is not valid', () => {});

    test('license returns valid id', () => {
      const id = '1234-12345';
      const license = new License(id);

      expect(license.getLicense()).toEqual(id);
    });
  });
});

describe('test Doctor object', () => {
  describe('doctor creation tests', () => {});

  describe('doctor method tests', () => {
    beforeEach(() => {
      DoctorRepository.mockClear();
    });

    it('should fetch patient with their status', async () => {
      const mockFetchPatients = jest
          .spyOn(DoctorRepository.prototype, 'getPatients')
          .mockImplementation(() => [
            {
              uid: 'patient-1',
              name: 'John Doe',
            },
            {
              uid: 'patient-2',
              name: 'Jane Doe',
            },
          ]);
      const mockFetchPatientStatus = jest
          .spyOn(DoctorRepository.prototype, 'getPatientStatus')
          .mockImplementation((x) => {
            if (x === 'patient-1') {
              return {
                covidStatus: 'Negative',
              };
            } else if (x === 'patient-2') {
              return {
                covidStatus: 'Positive',
              };
            }
            return {
              covidStatus: null,
            };
          });


      const doctor = new Doctor(new UserId('123456'), new DoctorRepository(''));
      const response = await doctor.getPatients();

      expect(mockFetchPatients).toHaveBeenCalledTimes(1);
      expect(mockFetchPatientStatus).toHaveBeenCalledTimes(2);
      expect(response[0].uid).toBe('patient-1');
      expect(response[0].status).toBe('Negative');
      expect(response[1].uid).toBe('patient-2');
      expect(response[1].status).toBe('Positive');
    });

    describe('create appointment', () => {
      let mockInsertAppointment;
      let mockInsertNotification;
      beforeEach(() => {
        DoctorRepository.mockClear();
        mockInsertAppointment = jest.spyOn(DoctorRepository.prototype, 'insertAppointment');
        mockInsertNotification = jest.spyOn(DoctorRepository.prototype, 'insertNotification');
      });

      afterEach(() => {
        mockInsertAppointment.mockRestore();
        mockInsertNotification.mockRestore();
      });

      it('should notify the user after saving the appointment', async () => {
        mockInsertAppointment.mockImplementation(() => ({acknowledged: true}));
        const doctor = new Doctor(new UserId('12345'), new DoctorRepository(''));
        const patientId = '12345';

        await doctor.createAppointment(patientId, {title: ''});

        expect(mockInsertAppointment).toHaveBeenCalledTimes(1);
        expect(mockInsertNotification).toHaveBeenCalledTimes(1);
      });

      it('should throw an error if appointment is not saved properly', async () => {
        mockInsertAppointment.mockImplementation(() => ({acknowledged: false}));
        const doctor = new Doctor(new UserId('12345'), new DoctorRepository(''));
        const patientId = '12345';

        try {
          await doctor.createAppointment(patientId, {title: ''});
        } catch (e) {
          expect(e.message).toEqual('The appointment was not saved.');
        }

        expect(mockInsertAppointment).toHaveBeenCalledTimes(1);
        expect(mockInsertNotification).toHaveBeenCalledTimes(0);
      });
    });

    describe('verify doctor', () => {
      let mockVerifyDoctor;
      beforeEach(() => {
        DoctorRepository.mockClear();
        mockVerifyDoctor = jest.spyOn(DoctorRepository.prototype, 'verifyDoctor');
      });

      afterEach(() => {
        mockVerifyDoctor.mockRestore();
      });

      it('should pass when user is a doctor', async () => {
        mockVerifyDoctor.mockImplementation(() => ({userType: 'doctor', userStatus: 'approved'}));
        const doctor = new Doctor(new UserId('12345'), new DoctorRepository(''));
        doctor.verifyDoctor()
            .then(() => {
              expect(true).toBe(true);
            }).catch((e) => {
              expect(true).toBe(false);
            });
      });

      it('should throw when user is not doctor', async () => {
        mockVerifyDoctor.mockImplementation(() => ({userType: 'patient', userStatus: 'approved'}));
        const doctor = new Doctor(new UserId('12345'), new DoctorRepository(''));
        doctor.verifyDoctor().catch((e) => {
          expect(e.message).toBe('Not a valid doctor');
        });
      });

      it('should throw when user is not approved', async () => {
        mockVerifyDoctor.mockImplementation(() => ({userType: 'doctor', userStatus: 'rejected'}));
        const doctor = new Doctor(new UserId('12345'), new DoctorRepository(''));
        doctor.verifyDoctor().catch((e) => {
          expect(e.message).toBe('Not a valid doctor');
        });
      });

      it('should throw when userType is not set', async () => {
        mockVerifyDoctor.mockImplementation(() => ({userStatus: 'rejected'}));
        const doctor = new Doctor(new UserId('12345'), new DoctorRepository(''));
        doctor.verifyDoctor().catch((e) => {
          expect(e.message).toBe('Not a valid doctor');
        });
      });

      it('should throw when userStatus is set', async () => {
        mockVerifyDoctor.mockImplementation(() => ({userType: 'doctor'}));
        const doctor = new Doctor(new UserId('12345'), new DoctorRepository(''));
        doctor.verifyDoctor().catch((e) => {
          expect(e.message).toBe('Not a valid doctor');
        });
      });

      it('should throw when no data is returned', async () => {
        mockVerifyDoctor.mockImplementation(() => {});
        const doctor = new Doctor(new UserId('12345'), new DoctorRepository(''));
        doctor.verifyDoctor().catch((e) => {
          expect(e.message).toBe('Not a valid doctor');
        });
      });
    });
  });
});
