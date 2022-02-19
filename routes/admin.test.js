const request = require('supertest');
const app = require('../app');
const server = require('../app').server;
const MongoClient = require('mongodb').MongoClient;
const AdminRepository = require('../repository/AdminRepository');
jest.mock('../repository/AdminRepository');
jest.mock('mongodb');

describe('integration test of admin routes', () => {
  afterAll(() => {
    server.close();
  });

  describe('fetch doctors info routes', () => {
    beforeEach(() => {
      AdminRepository.mockClear();
      jest.spyOn(AdminRepository.prototype, 'fetchDoctors')
          .mockImplementation(() => [
            {
              'uid': 'doctor-1',
              'name': 'John Doe',
              'address': '1234 street',
              'doctorInfo': {
                'patientCount': 2,
              },
            }, {
              'uid': 'doctor-2',
              'name': 'Jane Doe',
              'address': '4321 street',
              'doctorInfo': {
                'patientCount': 1,
              },
            },
          ]);
      jest.spyOn(MongoClient.prototype, 'connect')
          .mockImplementation(() => {});
    });

    it('should return array of doctor with status 200', async () => {
      const response = await request(app).get('/admin/1234/doctors');

      expect(response.statusCode).toBe(200);
      expect(JSON.stringify(response.body.data)).toBe(JSON.stringify([
        {
          'uid': 'doctor-1',
          'name': 'John Doe',
          'address': '1234 street',
          'patientCount': 2,
        }, {
          'uid': 'doctor-2',
          'name': 'Jane Doe',
          'address': '4321 street',
          'patientCount': 1,
        },
      ]));
    });

    it('should return status 400 and error message on error', async () => {
      jest.spyOn(AdminRepository.prototype, 'verifyAdmin')
          .mockImplementationOnce(() => {
            throw new Error('The admin is not valid');
          });

      const response = await request(app).get('/admin/1234/doctors');

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('The admin is not valid');
    });
  });

  describe('fetch unassigned patients info routes', () => {
    beforeEach(() => {
      AdminRepository.mockClear();
      jest.spyOn(AdminRepository.prototype, 'fetchPatients')
          .mockImplementation(() => [
            {
              'uid': 'doctor-1',
              'name': 'John Doe',
              'dob': '1111-11-11',
              'address': '1234 street',
            }, {
              'uid': 'doctor-2',
              'name': 'Jane Doe',
              'dob': '2222-22-22',
              'address': '4321 street',
            },
          ]);
      jest.spyOn(MongoClient.prototype, 'connect')
          .mockImplementation(() => {});
    });

    it('should return array of doctor with status 200', async () => {
      const response = await request(app).get('/admin/1234/patients');

      expect(response.statusCode).toBe(200);
      expect(JSON.stringify(response.body.data)).toBe(JSON.stringify([
        {
          'uid': 'doctor-1',
          'name': 'John Doe',
          'dob': '1111-11-11',
          'address': '1234 street',
        }, {
          'uid': 'doctor-2',
          'name': 'Jane Doe',
          'dob': '2222-22-22',
          'address': '4321 street',
        },
      ]));
    });

    it('should return status 400 and error message on error', async () => {
      jest.spyOn(AdminRepository.prototype, 'verifyAdmin')
          .mockImplementationOnce(() => {
            throw new Error('The admin is not valid');
          });

      const response = await request(app).get('/admin/1234/patients');

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('The admin is not valid');
    });
  });

  describe('assign doctor to patient route', () => {
    beforeEach(() => {
      AdminRepository.mockClear();
      jest.spyOn(AdminRepository.prototype, 'assignPatient')
          .mockImplementation(() => ({
            value: {
              patientInfo: {
                doctor: 'doctor-1',
              },
            },
          }));
      jest.spyOn(AdminRepository.prototype, 'incrementDoctorPatientCount')
          .mockImplementation(() => {});
    });
    it('should return success message on assigning doctor to patient', async () => {
      const response = await request(app).post('/admin/1234/patient')
          .send({
            patient: '12345',
            doctor: 'doctor-1',
          });

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('success');
    });

    it('should return status 400 and error message on error', async () => {
      jest.spyOn(AdminRepository.prototype, 'verifyAdmin')
          .mockImplementationOnce(() => {
            throw new Error('The admin is not valid');
          });

      const response = await request(app).post('/admin/1234/patient')
          .send({
            patient: '12345',
            doctor: 'doctor-1',
          });

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('The admin is not valid');
    });
  });
});
