const request = require('supertest');
const HealthOfficialRepository = require('../repository/HealthOfficialRepository');
const app = require('../app');
const server = require('../app').server;

jest.mock('../WebSockets/socketIO');
jest.mock('../repository/HealthOfficialRepository');
jest.mock('mongodb');

describe('integration test healthOfficialRoutes - connection to domain', () => {
  afterAll(() => {
    server.close();
  });

  describe('test GET /health-official/:healthOfficialId/patients', () => {
    jest.spyOn(HealthOfficialRepository.prototype, 'viewAllPatients').mockImplementation(() => {});

    it('should be able to view patients', async () => {
      const res = await request(app).get('/health-official/17765/patients');
      expect(res.status).toEqual(200);
    });

    it('should return status 400 on error', async () => {
      jest
        .spyOn(HealthOfficialRepository.prototype, 'viewAllPatients')
        .mockImplementationOnce(() => {
          throw new Error('error');
        });

      const res = await request(app).get('/health-official/17765/patients');
      expect(res.status).toEqual(400);
      expect(res.body.error).toEqual('error');
    });
  });

  describe('post healthOfficial raise flag', () => {
    let mockPost;
    let mockVerify;
    beforeEach(() => {
      HealthOfficialRepository.mockClear();
      mockPost = jest
        .spyOn(HealthOfficialRepository.prototype, 'raiseFlag')
        .mockImplementation(() => true);
      mockVerify = jest.spyOn(HealthOfficialRepository.prototype, 'verifyHealthOfficial');
    });

    afterEach(() => {
      mockPost.mockRestore();
      mockVerify.mockRestore();
    });

    it('should return flagged raise with status 200', async () => {
      const response = await request(app).post('/health-official/1234/raise-flag').send({
        patientId: '12345',
        flagValue: true,
      });
      expect(response.statusCode).toBe(201);
      expect(response.body.data).toBe(true);
      expect(mockPost).toHaveBeenCalledTimes(1);
      expect(mockVerify).toHaveBeenCalledTimes(1);
    });

    it('should return status 400 and error message on error', async () => {
      mockVerify.mockImplementation(() => {
        throw new Error('The health official is not valid');
      });

      const response = await request(app).post('/health-official/1234/raise-flag');

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('The health official is not valid');
      expect(mockPost).not.toHaveBeenCalled();
      expect(mockVerify).toHaveBeenCalledTimes(1);
    });
  });

  describe('/:healthOfficialId/user-covid-info', () => {
    let mockPost;
    beforeEach(() => {
      HealthOfficialRepository.mockClear();
      mockPost = jest
        .spyOn(HealthOfficialRepository.prototype, 'viewUserCovidInformation')
        .mockReturnValue({name: 'John'});
    });

    afterEach(() => {
      mockPost.mockRestore();
    });

    it('should return flagged raise with status 200', async () => {
      const response = await request(app).get('/health-official/1234/user-covid-info');

      expect(response.statusCode).toBe(200);
      expect(response.body.profile).toEqual(
        expect.objectContaining({
          name: 'John',
        }),
      );
      expect(mockPost).toHaveBeenCalledTimes(1);
    });

    it('should return status 400 and error message on error', async () => {
      mockPost.mockImplementationOnce(() => {
        throw new Error('The health official is not valid');
      });

      const response = await request(app).get('/health-official/1234/user-covid-info');

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('The health official is not valid');
      expect(mockPost).toHaveBeenCalledTimes(1);
    });
  });

  describe('/:healthOfficialId/user-report', () => {
    let mockPost;
    beforeEach(() => {
      HealthOfficialRepository.mockClear();
      mockPost = jest
        .spyOn(HealthOfficialRepository.prototype, 'fetchReport')
        .mockReturnValue({name: 'John'});
    });

    afterEach(() => {
      mockPost.mockRestore();
    });

    it('should return flagged raise with status 200', async () => {
      const response = await request(app).get('/health-official/1234/user-report');

      expect(response.statusCode).toBe(200);
      expect(response.body.reports).toEqual(
        expect.objectContaining({
          name: 'John',
        }),
      );
      expect(mockPost).toHaveBeenCalledTimes(1);
    });

    it('should return status 400 and error message on error', async () => {
      mockPost.mockImplementationOnce(() => {
        throw new Error('The health official is not valid');
      });

      const response = await request(app).get('/health-official/1234/user-report');

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('The health official is not valid');
      expect(mockPost).toHaveBeenCalledTimes(1);
    });
  });

  describe('/:healthOfficialId/report-contact-list', () => {
    let mockPost;
    beforeEach(() => {
      HealthOfficialRepository.mockClear();
      mockPost = jest
        .spyOn(HealthOfficialRepository.prototype, 'viewReportContacts')
        .mockReturnValue({name: 'report-1'});
    });

    afterEach(() => {
      mockPost.mockRestore();
    });

    it('should return flagged raise with status 200', async () => {
      const response = await request(app).get('/health-official/1234/report-contact-list');

      expect(response.statusCode).toBe(200);
      expect(response.body.contacts).toEqual(
        expect.objectContaining({
          name: 'report-1',
        }),
      );
      expect(mockPost).toHaveBeenCalledTimes(1);
    });

    it('should return status 400 and error message on error', async () => {
      mockPost.mockImplementationOnce(() => {
        throw new Error('The health official is not valid');
      });

      const response = await request(app).get('/health-official/1234/report-contact-list');

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('The health official is not valid');
      expect(mockPost).toHaveBeenCalledTimes(1);
    });
  });
});
