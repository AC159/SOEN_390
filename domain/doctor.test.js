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
  });
});
