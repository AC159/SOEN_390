const request = require('supertest');
const app = require('../app');
const Administrator = require('../domain/administrator');
const server = require('../app').server;
const MongoClient = require('mongodb').MongoClient;
const AdminRepository = require('../repository/AdminRepository');

jest.mock('../WebSockets/socketIO');
jest.mock('../repository/AdminRepository');
jest.mock('mongodb');

describe('integration test of admin routes', () => {
  afterAll(() => {
    server.close();
  });

  describe('fetch pending patients route', () => {
    let mockFetch;
    let mockValidate;
    beforeEach(() => {
      AdminRepository.mockClear();
      mockFetch = jest
        .spyOn(AdminRepository.prototype, 'fetchPendingUsers')
        .mockImplementation(() => [
          {
            uid: 'patient-1',
            name: 'John Doe',
            address: '1234 street',
          },
          {
            uid: 'patient-2',
            name: 'Jane Doe',
            address: '4321 street',
          },
        ]);
      mockValidate = jest.spyOn(AdminRepository.prototype, 'verifyAdmin');
    });

    afterEach(() => {
      mockFetch.mockRestore();
      mockValidate.mockRestore();
    });

    it('should return array of pending patients with status 200', async () => {
      const response = await request(app).get('/admin/1234/pending-patients');

      expect(response.statusCode).toBe(200);
      expect(JSON.stringify(response.body.users)).toBe(
        JSON.stringify([
          {
            uid: 'patient-1',
            name: 'John Doe',
            address: '1234 street',
          },
          {
            uid: 'patient-2',
            name: 'Jane Doe',
            address: '4321 street',
          },
        ]),
      );
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockValidate).toHaveBeenCalledTimes(1);
    });

    it('should return status 400 and error message on error', async () => {
      jest.spyOn(AdminRepository.prototype, 'verifyAdmin').mockImplementationOnce(() => {
        throw new Error('The admin is not valid');
      });

      const response = await request(app).get('/admin/1234/pending-patients');

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('The admin is not valid');
      expect(mockFetch).not.toHaveBeenCalled();
      expect(mockValidate).toHaveBeenCalledTimes(1);
    });
  });

  describe('fetch doctors info routes', () => {
    beforeEach(() => {
      AdminRepository.mockClear();
      jest.spyOn(AdminRepository.prototype, 'fetchDoctors').mockImplementation(() => [
        {
          uid: 'doctor-1',
          name: 'John Doe',
          address: '1234 street',
          doctorInfo: {
            patientCount: 2,
          },
        },
        {
          uid: 'doctor-2',
          name: 'Jane Doe',
          address: '4321 street',
          doctorInfo: {
            patientCount: 1,
          },
        },
      ]);
      jest.spyOn(MongoClient.prototype, 'connect').mockImplementation(() => {});
    });

    it('should return array of doctor with status 200', async () => {
      const response = await request(app).get('/admin/1234/doctors');

      expect(response.statusCode).toBe(200);
      expect(JSON.stringify(response.body.data)).toBe(
        JSON.stringify([
          {
            uid: 'doctor-1',
            name: 'John Doe',
            address: '1234 street',
            patientCount: 2,
          },
          {
            uid: 'doctor-2',
            name: 'Jane Doe',
            address: '4321 street',
            patientCount: 1,
          },
        ]),
      );
    });

    it('should return status 400 and error message on error', async () => {
      jest.spyOn(AdminRepository.prototype, 'verifyAdmin').mockImplementationOnce(() => {
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
      jest.spyOn(AdminRepository.prototype, 'fetchPatients').mockImplementation(() => [
        {
          uid: 'patient-1',
          name: 'John Doe',
          dob: '1111-11-11',
          address: '1234 street',
          patientInfo: {
            doctor: 'Dr. Doe',
            doctorId: 'doctor-1',
          },
        },
        {
          uid: 'patient-2',
          name: 'Jane Doe',
          dob: '2222-22-22',
          address: '4321 street',
          patientInfo: {
            doctor: 'Dr. Doe',
            doctorId: 'doctor-1',
          },
        },
      ]);
      jest.spyOn(MongoClient.prototype, 'connect').mockImplementation(() => {});
    });

    it('should return array of doctor with status 200', async () => {
      const response = await request(app).get('/admin/1234/patients');

      expect(response.statusCode).toBe(200);
      expect(JSON.stringify(response.body.data)).toBe(
        JSON.stringify([
          {
            uid: 'patient-1',
            name: 'John Doe',
            dob: '1111-11-11',
            address: '1234 street',
            patientInfo: {
              doctor: 'Dr. Doe',
              doctorId: 'doctor-1',
            },
          },
          {
            uid: 'patient-2',
            name: 'Jane Doe',
            dob: '2222-22-22',
            address: '4321 street',
            patientInfo: {
              doctor: 'Dr. Doe',
              doctorId: 'doctor-1',
            },
          },
        ]),
      );
    });

    it('should return status 400 and error message on error', async () => {
      jest.spyOn(AdminRepository.prototype, 'verifyAdmin').mockImplementationOnce(() => {
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
      jest.spyOn(AdminRepository.prototype, 'assignPatient').mockImplementation(() => ({
        value: {
          patientInfo: {
            doctor: 'doctor-1',
          },
        },
      }));
      jest
        .spyOn(AdminRepository.prototype, 'incrementDoctorPatientCount')
        .mockImplementation(() => {});
    });
    it('should return success message on assigning doctor to patient', async () => {
      const response = await request(app).post('/admin/1234/patient').send({
        patient: '12345',
        doctor: 'doctor-1',
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('success');
    });

    it('should return status 400 and error message on error', async () => {
      jest.spyOn(AdminRepository.prototype, 'verifyAdmin').mockImplementationOnce(() => {
        throw new Error('The admin is not valid');
      });

      const response = await request(app).post('/admin/1234/patient').send({
        patient: '12345',
        doctor: 'doctor-1',
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('The admin is not valid');
    });
  });

  describe('/:adminId/pending-doctors', () => {
    beforeEach(() => {
      AdminRepository.mockClear();
      jest.spyOn(AdminRepository.prototype, 'fetchPendingUsers').mockImplementation(() => [
        {
          name: 'doctor',
        },
      ]);
    });

    it('should return list of doctor', async () => {
      const response = await request(app).get('/admin/1234/pending-doctors');

      expect(response.statusCode).toBe(200);
      expect(response.body.doctors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'doctor',
          }),
        ]),
      );
    });

    it('should return status 400 and error message on error', async () => {
      jest.spyOn(AdminRepository.prototype, 'verifyAdmin').mockImplementationOnce(() => {
        throw new Error('The admin is not valid');
      });

      const response = await request(app).get('/admin/1234/pending-doctors');

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('The admin is not valid');
    });
  });

  describe('/:adminId/pending-health-officials', () => {
    beforeEach(() => {
      AdminRepository.mockClear();
      jest.spyOn(AdminRepository.prototype, 'fetchPendingUsers').mockImplementation(() => [
        {
          name: 'health-officials',
        },
      ]);
    });

    it('should return list of health officials', async () => {
      const response = await request(app).get('/admin/1234/pending-health-officials');

      expect(response.statusCode).toBe(200);
      expect(response.body.healthOfficials).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'health-officials',
          }),
        ]),
      );
    });

    it('should return status 400 and error message on error', async () => {
      jest.spyOn(AdminRepository.prototype, 'verifyAdmin').mockImplementationOnce(() => {
        throw new Error('The admin is not valid');
      });

      const response = await request(app).get('/admin/1234/pending-health-officials');

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('The admin is not valid');
    });
  });

  describe('/:adminId/pending-immigration-officials', () => {
    beforeEach(() => {
      AdminRepository.mockClear();
      jest.spyOn(AdminRepository.prototype, 'fetchPendingUsers').mockImplementation(() => [
        {
          name: 'immigration-officials',
        },
      ]);
    });

    it('should return list of health officials', async () => {
      const response = await request(app).get('/admin/1234/pending-immigration-officials');

      expect(response.statusCode).toBe(200);
      expect(response.body.immigrationOfficials).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'immigration-officials',
          }),
        ]),
      );
    });

    it('should return status 400 and error message on error', async () => {
      jest.spyOn(AdminRepository.prototype, 'verifyAdmin').mockImplementationOnce(() => {
        throw new Error('The admin is not valid');
      });

      const response = await request(app).get('/admin/1234/pending-immigration-officials');

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('The admin is not valid');
    });
  });

  describe('/:adminId/approve-user', () => {
    let emailMock;
    beforeEach(() => {
      AdminRepository.mockClear();
      jest.spyOn(AdminRepository.prototype, 'approveUser').mockReturnValue({
        value: {
          userType: 'administator',
        },
      });

      emailMock = jest
        .spyOn(Administrator.prototype, 'sendConfirmationEmail')
        .mockReturnValue('response');
    });

    it('should return list of health officials', async () => {
      const response = await request(app).post('/admin/1234/approve-user').send({
        userId: '0987',
        userEmail: 'test@email.com',
        message: 'email message',
      });

      expect(response.statusCode).toBe(200);
      expect(emailMock).toHaveBeenCalledWith('test@email.com', 'email message');
      expect(response.body).toEqual(
        expect.objectContaining({
          data: expect.objectContaining({userType: 'administator'}),
          emailResponse: 'response',
        }),
      );
    });

    it('should return status 400 and error message on error', async () => {
      jest.spyOn(AdminRepository.prototype, 'verifyAdmin').mockImplementationOnce(() => {
        throw new Error('The admin is not valid');
      });

      const response = await request(app).post('/admin/1234/approve-user').send({
        userId: '0987',
        userEmail: 'test@email.com',
        message: 'email message',
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('The admin is not valid');
    });
  });

  describe('/:adminId/reject-user', () => {
    beforeEach(() => {
      AdminRepository.mockClear();
      jest.spyOn(AdminRepository.prototype, 'rejectUser').mockReturnValue('rejected');
    });

    it('should return list of health officials', async () => {
      const response = await request(app).post('/admin/1234/reject-user').send({
        userId: '0987',
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.data).toEqual('rejected');
    });

    it('should return status 400 and error message on error', async () => {
      jest.spyOn(AdminRepository.prototype, 'verifyAdmin').mockImplementationOnce(() => {
        throw new Error('The admin is not valid');
      });

      const response = await request(app).post('/admin/1234/reject-user').send({
        userId: '0987',
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('The admin is not valid');
    });
  });
});
