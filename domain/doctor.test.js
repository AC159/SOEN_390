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
            covidStatus: 'Negative',
          },
          {
            uid: 'patient-2',
            name: 'Jane Doe',
            covidStatus: 'Positive',
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
      expect(mockFetchPatientStatus).toHaveBeenCalledTimes(0);
      expect(response[0].uid).toBe('patient-1');
      expect(response[0].covidStatus).toBe('Negative');
      expect(response[1].uid).toBe('patient-2');
      expect(response[1].covidStatus).toBe('Positive');
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

    it('should get Patient Array', async () => {
      const doctorRepo = new DoctorRepository('');
      doctorRepo.getPatients.mockResolvedValueOnce([
        {
          uid: '4321',
        },
        {
          uid: '5432',
        },
      ]);
      doctorRepo.getPatientStatus.mockImplementation((id) => {
        if (id === '4321') return {covidStatus: 'Positive'};
        else return null;
      });

      const doctor = new Doctor(new UserId('12345'), doctorRepo);
      const patients = await doctor.getPatientArrays();

      expect(doctorRepo.getPatients).toHaveBeenCalledWith('12345');
      expect(doctorRepo.getPatientStatus).toHaveBeenCalledWith('4321');
      expect(patients).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            uid: '4321',
            status: 'Positive',
          }),
          expect.objectContaining({
            uid: '5432',
            status: 'Not tested',
          }),
        ]),
      );
    });

    it('should be able to post questions', async () => {
      const doctorRepo = new DoctorRepository('');
      doctorRepo.storeQuestions.mockReturnValue({
        succes: true,
      });

      const doctor = new Doctor(new UserId('12345'), doctorRepo);
      const res = await doctor.postQuestions([{answer: '', question: 'a question?'}]);

      expect(doctorRepo.storeQuestions).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            answer: '',
            question: 'a question?',
          }),
        ]),
      );
      expect(res).toEqual(expect.objectContaining({succes: true}));
    });

    it('should be able to get appointments', async () => {
      const doctorRepo = new DoctorRepository('');
      doctorRepo.findAppointments.mockReturnValue([
        {
          appointmentId: 1,
        },
      ]);

      const doctor = new Doctor(new UserId('12345'), doctorRepo);
      const appointment = await doctor.getAppointments();

      expect(doctorRepo.verifyDoctor).toHaveBeenCalledTimes(1);
      expect(doctorRepo.findAppointments).toHaveBeenCalledWith('12345');
      expect(appointment).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            appointmentId: 1,
          }),
        ]),
      );
    });
  });
});
