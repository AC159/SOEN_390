const HealthOfficial = require('./healthOfficial');
const {ObjectId} = require("mongodb");
const HealthOfficialRepository = require("../repository/HealthOfficialRepository");

jest.mock('../repository/HealthOfficialRepository');

describe('test HealthOfficial object', () => {
  describe('test HealthOfficial constructor', () => {
    test('should return user id', () => {
      const healthOfficial = new HealthOfficial('1a2b3c4d5e', null);
      expect(healthOfficial.getId()).toEqual('1a2b3c4d5e');
    });
  });

  describe('integration test - ImmigrationOfficial connection to repository', () => {
    const repository = new HealthOfficialRepository();
    const healthOfficial = new HealthOfficial(new ObjectId(), repository);

    test('GET /health-official/17765/patients', async () => {
      await healthOfficial.getAllPatients();
      expect(repository.viewAllPatients).toHaveBeenCalledTimes(1);
    });
  });
});
