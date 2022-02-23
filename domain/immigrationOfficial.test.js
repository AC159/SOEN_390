const ImmigrationOfficial = require('./immigrationOfficial');

describe('test ImmigrationOfficial object', () => {
  describe('test ImmigrationOfficial constructor', () => {
    test('should return user id', () => {
      const immigrationOfficial = new ImmigrationOfficial('1a2b3c4d5e', null);
      expect(immigrationOfficial.getId()).toEqual('1a2b3c4d5e');
    });
  });
});
