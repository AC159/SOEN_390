const {ImmigrationOfficial} = require('./immigrationOfficial');
const {ObjectId} = require("mongodb");
const ImmigrationOfficialRepository = require("../repository/ImmigrationOfficialRepository");

jest.mock('../repository/ImmigrationOfficialRepository');

describe('test ImmigrationOfficial object', () => {
  describe('test ImmigrationOfficial constructor', () => {
    test('should return user id', () => {
      const immigrationOfficial = new ImmigrationOfficial('1a2b3c4d5e', null);
      expect(immigrationOfficial.getId()).toEqual('1a2b3c4d5e');
    });
  });

  describe('integration test - ImmigrationOfficial connection to repository', () => {
    const repository = new ImmigrationOfficialRepository();
    const immigrationOfficial = new ImmigrationOfficial(new ObjectId(), repository);

    test('GET /immigration-official/19965/patients', async () => {
      await immigrationOfficial.getAllPatients();
      expect(repository.viewAllPatients).toHaveBeenCalledTimes(1);
    });
  });
});
