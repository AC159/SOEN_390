const request = require('supertest');
const MongoClient = require('mongodb').MongoClient;
const {HealthOfficial} = require('../domain/healthOfficial');
const app = require('../app');
const server = require('../app').server;

jest.mock('../domain/healthOfficial');
jest.mock('mongodb');

describe('integration test healthOfficialRoutes - connection to domain', () => {
  afterEach(() => {
    server.close();
  });

  describe('test GET /health-official/:healthOfficialId/patients', () => {
    jest.spyOn(HealthOfficial.prototype, 'getAllPatients').mockImplementation(() => {});
    jest.spyOn(MongoClient.prototype, 'connect').mockImplementation(() => {});

    it('should be able to view patients', async () => {
      const res = await request(app).get('/health-official/17765/patients');
      expect(res.status).toEqual(200);
    });
  });
});
