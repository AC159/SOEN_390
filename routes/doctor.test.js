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
              covidStatus: 'Negative'
            },
            {
              uid: 'patient-2',
              name: 'Jane Doe',
              covidStatus: 'Positive'
            },
          ])
          .mockImplementationOnce(() => {
            throw new Error('There was an error.');
          });
    });

    it('should return array of patient with status and status 200', async () => {
      const response = await request(app).get('/doctor/1234/patientArray');

      expect(response.status).toBe(200);
      expect(JSON.stringify(response.body.data)).toBe(JSON.stringify([
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
      ]));
    });

    it('should return status 400 and error message on error', async () => {
      const response = await request(app).get('/doctor/1234/patientArray');

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('There was an error.');
    });
  });

  describe('post doctor raise flag', () => {
    let mockPost;
    beforeEach(() => {
      DoctorRepository.mockClear();
      mockPost = jest.spyOn(DoctorRepository.prototype, 'raiseFlag')
          .mockImplementation(() => true);
    });

    afterEach(() => {
      mockPost.mockRestore();
    });

    it('should return flagged raise with status 200', async () => {
      const response = await request(app)
          .post('/doctor/1234/raise-flag')
          .send({
            patientId: '12345',
            flagValue: true,
          });
      expect(response.statusCode).toBe(201);
      expect(response.body.data).toBe(true);
      expect(mockPost).toHaveBeenCalledTimes(1);
    });

    it('should return status 400 and error message on error', async () => {
      mockPost.mockImplementation(() => {
        throw new Error('The doctor is not valid');
      });

      const response = await request(app).post('/doctor/1234/raise-flag');

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('The doctor is not valid');
      expect(mockPost).toHaveBeenCalledTimes(1);
    });
  });

  describe('create patient appointment', () => {
    beforeEach(() => {
      DoctorRepository.mockClear();
      jest.spyOn(DoctorRepository.prototype, 'insertAppointment')
          .mockImplementationOnce(() => ({acknowledged: true}))
          .mockImplementationOnce(() => ({acknowledged: false}));
      jest.spyOn(DoctorRepository.prototype, 'insertNotification');
    });

    it('should acknowledge the insertion of an appointment & notification', async () => {
      const response = await request(app)
          .post('/doctor/1234/appointment')
          .send({
            patientId: 'patient-1',
            title: 'title',
            information: 'additional informaiton',
          })
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/);

      expect(response.statusCode).toBe(200);
      expect(JSON.stringify(response.body))
          .toBe(JSON.stringify({message: 'success'}));
    });

    it('should return status 400 when there is an error', async () => {
      const response = await request(app)
          .post('/doctor/1234/appointment')
          .send({
            patientId: 'patient-1',
            title: 'title',
            information: 'additional informaiton',
          })
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/);

      expect(response.statusCode).toBe(400);
      expect(JSON.stringify(response.body))
          .toBe(JSON.stringify({error: 'The appointment was not saved.'}));
    });
  });
});
