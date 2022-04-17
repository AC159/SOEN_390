const request = require('supertest');
const ImmigrationOfficialRepository = require('../repository/ImmigrationOfficialRepository');
const app = require('../app');
const server = require('../app').server;

jest.mock('../WebSockets/socketIO');
jest.mock('mongodb');
jest.mock('../repository/ImmigrationOfficialRepository');

describe('integration test immigrationOfficialRoutes - connection to domain', () => {
  afterAll(() => {
    server.close();
  });

  describe('post healthOfficial raise flag', () => {
    let mockPost;
    beforeEach(() => {
      ImmigrationOfficialRepository.mockClear();
      mockPost = jest.spyOn(ImmigrationOfficialRepository.prototype, 'raiseFlag');
    });

    afterEach(() => {
      mockPost.mockRestore();
    });

    it('should return flagged raise with status 200', async () => {
      mockPost.mockImplementation(() => true);

      const response = await request(app).post('/immigration-official/1234/raise-flag').send({
        patientId: '12345',
        flagValue: true,
      });
      expect(response.statusCode).toBe(201);
      expect(response.body.data).toBe(true);
      expect(mockPost).toHaveBeenCalledTimes(1);
    });

    it('should return status 400 and error message on error', async () => {
      mockPost.mockImplementation(() => {
        throw new Error('The Immigration Officer is not valid');
      });

      const response = await request(app).post('/immigration-official/1234/raise-flag');

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('The Immigration Officer is not valid');
      expect(mockPost).toHaveBeenCalledTimes(1);
    });
  });

  describe('test GET /immigration-official/:immigrationOfficialId/patients', () => {
    jest
      .spyOn(ImmigrationOfficialRepository.prototype, 'viewAllPatients')
      .mockImplementation(() => {});

    it('should be able to view patients', async () => {
      const res = await request(app).get('/immigration-official/19965/patients');
      expect(res.status).toEqual(200);
    });

    it('should return status 400 on error', async () => {
      jest
        .spyOn(ImmigrationOfficialRepository.prototype, 'viewAllPatients')
        .mockImplementationOnce(() => {
          throw new Error('error');
        });

      const res = await request(app).get('/immigration-official/17765/patients');
      expect(res.status).toEqual(400);
      expect(res.body.error).toEqual('error');
    });
  });

  describe('/:immigrationOfficialId/user-covid-info', () => {
    let mockPost;
    beforeEach(() => {
      mockPost = jest.spyOn(ImmigrationOfficialRepository.prototype, 'viewUserCovidInformation');
    });

    afterEach(() => {
      mockPost.mockRestore();
    });

    it('should return flagged raise with status 200', async () => {
      mockPost.mockReturnValue({name: 'John'});

      const response = await request(app).get('/immigration-official/1234/user-covid-info');

      expect(response.statusCode).toBe(200);
      expect(response.body.profile).toEqual(
        expect.objectContaining({
          name: 'John',
        }),
      );
      expect(mockPost).toHaveBeenCalledTimes(1);
    });

    it('should return status 400 and error message on error', async () => {
      mockPost.mockImplementation(() => {
        throw new Error('The Immigration Officer is not valid');
      });

      const response = await request(app).get('/immigration-official/1234/user-covid-info');

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('The Immigration Officer is not valid');
      expect(mockPost).toHaveBeenCalledTimes(1);
    });
  });

  describe('/:immigrationOfficialId/traveler-info', () => {
    let mockPost;
    beforeEach(() => {
      mockPost = jest.spyOn(ImmigrationOfficialRepository.prototype, 'viewTravelerProfile');
    });

    afterEach(() => {
      mockPost.mockRestore();
    });

    it('should return flagged raise with status 200', async () => {
      mockPost.mockReturnValue({name: 'John'});

      const response = await request(app).get('/immigration-official/1234/traveler-info');

      expect(response.statusCode).toBe(200);
      expect(response.body.data).toEqual(
        expect.objectContaining({
          name: 'John',
        }),
      );
      expect(mockPost).toHaveBeenCalledTimes(1);
    });

    it('should return status 400 and error message on error', async () => {
      mockPost.mockImplementation(() => {
        throw new Error('The Immigration Officer is not valid');
      });

      const response = await request(app).get('/immigration-official/1234/traveler-info');

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('The Immigration Officer is not valid');
      expect(mockPost).toHaveBeenCalledTimes(1);
    });
  });

  describe('/get-travlers-form/:patientUid', () => {
    let mockPost;
    beforeEach(() => {
      mockPost = jest.spyOn(ImmigrationOfficialRepository.prototype, 'fetchTraveler');
    });

    afterEach(() => {
      mockPost.mockRestore();
    });

    it('should return flagged raise with status 200', async () => {
      mockPost.mockReturnValue({name: 'John'});

      const response = await request(app).get('/immigration-official/get-travlers-form/1234');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          name: 'John',
        }),
      );
      expect(mockPost).toHaveBeenCalledTimes(1);
    });

    it('should return status 400 and error message on error', async () => {
      mockPost.mockImplementation(() => {
        throw new Error('The Immigration Officer is not valid');
      });

      const response = await request(app).get('/immigration-official/get-travlers-form/1234');

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('The Immigration Officer is not valid');
      expect(mockPost).toHaveBeenCalledTimes(1);
    });
  });
});
