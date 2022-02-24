const HealthOfficial = require('./healthOfficial');

describe('test HealthOfficial object', () => {
  describe('test HealthOfficial constructor', () => {
    test('should return user id', () => {
      const healthOfficial = new HealthOfficial('1a2b3c4d5e', null);
      expect(healthOfficial.getId()).toEqual('1a2b3c4d5e');
    });
  });
});
