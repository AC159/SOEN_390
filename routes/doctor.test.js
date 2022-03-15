const request = require('supertest');
const app = require('../app');
const server = require('../app').server;
const DoctorRepository = require('../repository/DoctorRepository');
jest.mock('../repository/DoctorRepository');
jest.mock('mongodb');

describe('integration test of doctor routes', () => {
  afterAll(() => {
    server.close();
  });

  describe('fetch doctor patients route', () => {
    beforeEach(() => {
      DoctorRepository.mockClear();
      jest.spyOn(DoctorRepository.prototype, 'getPatients')
          .mockImplementationOnce(() => [
            {
              uid: 'patient-1',
              name: 'John Doe',
            },
            {
              uid: 'patient-2',
              name: 'Jane Doe',
            },
          ])
          .mockImplementationOnce(() => {
            throw new Error('There was an error.');
          });
      jest.spyOn(DoctorRepository.prototype, 'getPatientStatus')
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
    });

    it('should return array of patient with status and status 200', async () => {
      const response = await request(app).get('/doctor/1234/patientArray');

      expect(response.status).toBe(200);
      expect(JSON.stringify(response.body.data)).toBe(JSON.stringify([
        {
          uid: 'patient-1',
          name: 'John Doe',
          status: 'Negative',
        },
        {
          uid: 'patient-2',
          name: 'Jane Doe',
          status: 'Positive',
        },
      ]));
    });

    it('should return status 400 and error message on error', async () => {
      const response = await request(app).get('/doctor/1234/patientArray');

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('There was an error.');
    });
  });
});
