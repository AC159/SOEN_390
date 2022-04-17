const {HealthOfficial} = require('./healthOfficial');
const {ObjectId} = require('mongodb');
const {UserId} = require('./user');
const HealthOfficialRepository = require('../repository/HealthOfficialRepository');

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

  it('should get User covid info', async () => {
    const repo = new HealthOfficialRepository('');
    const healthOfficial = new HealthOfficial('1234', repo);
    repo.viewUserCovidInformation.mockReturnValue('success');

    const info = await healthOfficial.getUserCovidInfo('0987');

    expect(repo.viewUserCovidInformation).toHaveBeenCalledWith('1234', '0987');
    expect(info).toEqual('success');
  });

  it('should get report from user', async () => {
    const repo = new HealthOfficialRepository('');
    const healthOfficial = new HealthOfficial('1234', repo);
    repo.fetchReport.mockReturnValue('success');

    const info = await healthOfficial.getReportsFromUser('0987');

    expect(repo.fetchReport).toHaveBeenCalledWith('1234', '0987');
    expect(info).toEqual('success');
  });

  it('should get contact list from report', async () => {
    const repo = new HealthOfficialRepository('');
    const healthOfficial = new HealthOfficial('1234', repo);
    repo.viewReportContacts.mockReturnValue('success');

    const info = await healthOfficial.getContactListFromReport('0987');

    expect(repo.viewReportContacts).toHaveBeenCalledWith('1234', '0987');
    expect(info).toEqual('success');
  });
});
