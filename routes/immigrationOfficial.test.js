const request = require('supertest');
const MongoClient = require('mongodb').MongoClient;
const {ImmigrationOfficial} = require('../domain/immigrationOfficial');
const app = require('../app');
const server = require('../app').server;

jest.mock('../domain/immigrationOfficial');
jest.mock('mongodb');

describe('integration test immigrationOfficialRoutes - connection to domain', () => {
  afterEach(() => {
    server.close();
  });

  describe('test GET /immigration-official/:immigrationOfficialId/patients', () => {
    jest.spyOn(ImmigrationOfficial.prototype, 'getAllPatients').mockImplementation(() => {});
    jest.spyOn(MongoClient.prototype, 'connect').mockImplementation(() => {});

    it('should be able to view patients', async () => {
      const res = await request(app).get('/immigration-official/19965/patients');
      expect(res.status).toEqual(200);
    });
  });
})