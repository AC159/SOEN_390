const request = require('supertest');
const app = require('../app');
const server = require('../app').server;
const DoctorRepository = require('../repository/DoctorRepository');

jest.mock('../WebSockets/socketIO');
jest.mock('../repository/DoctorRepository');
jest.mock('mongodb');

describe('integration test of doctor routes', () => {
  afterAll(() => {
    server.close();
  });

  describe('fetch doctor patients route', () => {
    beforeEach(() => {
      DoctorRepository.mockClear();
      jest
        .spyOn(DoctorRepository.prototype, 'getPatients')
        .mockImplementationOnce(() => [
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
        ])
        .mockImplementationOnce(() => {
          throw new Error('There was an error.');
        });
    });

    it('should return array of patient with status and status 200', async () => {
      const response = await request(app).get('/doctor/1234/patientArray');

      expect(response.status).toBe(200);
      expect(JSON.stringify(response.body.data)).toBe(
        JSON.stringify([
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
        ]),
      );
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
      mockPost = jest.spyOn(DoctorRepository.prototype, 'raiseFlag').mockImplementation(() => true);
    });

    afterEach(() => {
      mockPost.mockRestore();
    });

    it('should return flagged raise with status 200', async () => {
      const response = await request(app).post('/doctor/1234/raise-flag').send({
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
      jest
        .spyOn(DoctorRepository.prototype, 'insertAppointment')
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
      expect(JSON.stringify(response.body)).toBe(JSON.stringify({message: 'success'}));
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
      expect(JSON.stringify(response.body)).toBe(
        JSON.stringify({error: 'The appointment was not saved.'}),
      );
    });
  });

  describe('/:doctorId/patientArrays', () => {
    beforeEach(() => {
      DoctorRepository.mockClear();
      jest
        .spyOn(DoctorRepository.prototype, 'getPatients')
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
      jest.spyOn(DoctorRepository.prototype, 'getPatientStatus').mockImplementation((id) => {
        if (id === 'patient-1') return {covidStatus: 'Negative'};
        else if (id === 'patient-2') return {covidStatus: 'Positive'};
        return {covidStatus: 'Not tested'};
      });
    });

    it('should return array of patient with status and status 200', async () => {
      const response = await request(app).get('/doctor/1234/patientArrays');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            uid: 'patient-1',
            name: 'John Doe',
            status: 'Negative',
          }),
          expect.objectContaining({
            uid: 'patient-2',
            name: 'Jane Doe',
            status: 'Positive',
          }),
        ]),
      );
    });

    it('should return status 400 and error message on error', async () => {
      const response = await request(app).get('/doctor/1234/patientArrays');

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('There was an error.');
    });
  });

  describe('/:doctorId/appointments', () => {
    beforeEach(() => {
      DoctorRepository.mockClear();
      jest.spyOn(DoctorRepository.prototype, 'findAppointments').mockReturnValue([
        {
          appointmentId: 1,
        },
      ]);
    });

    it('should return array of patient with status and status 200', async () => {
      const response = await request(app).get('/doctor/1234/appointments');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            appointmentId: 1,
          }),
        ]),
      );
    });

    it('should return status 400 and error message on error', async () => {
      jest
        .spyOn(DoctorRepository.prototype, 'findAppointments')
        .mockRejectedValue(new Error('The doctor is not valid'));
      const response = await request(app).get('/doctor/1234/appointments');

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('The doctor is not valid');
    });
  });

  describe('/question-answer', () => {
    beforeEach(() => {
      DoctorRepository.mockClear();
      jest
        .spyOn(DoctorRepository.prototype, 'storeQuestions')
        .mockResolvedValueOnce({message: 'success'})
        .mockImplementationOnce(() => {
          throw new Error('The Q&A was not saved.');
        });
    });

    it('should acknowledge the insertion of questions & answers', async () => {
      const response = await request(app)
        .post('/doctor/question-answer')
        .send({
          doctorUid: '1234',
          formId: '1',
          question: 'Question',
          answer: 'answer',
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining({data: expect.objectContaining({message: 'success'})}),
      );
    });

    it('should return status 400 when there is an error', async () => {
      const response = await request(app)
        .post('/doctor/question-answer')
        .send({
          doctorUid: '1234',
          formId: '1',
          question: 'Question',
          answer: 'answer',
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);

      expect(response.statusCode).toBe(400);
      expect(JSON.stringify(response.body)).toBe(JSON.stringify({error: 'The Q&A was not saved.'}));
    });
  });
});
