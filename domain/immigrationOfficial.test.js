const {ImmigrationOfficial} = require('./immigrationOfficial');
const ImmigrationOfficialRepository = require('../repository/ImmigrationOfficialRepository');
const UserId = require('../domain/user').UserId;

jest.mock('../repository/ImmigrationOfficialRepository');

describe('test ImmigrationOfficial object', () => {
  describe('test ImmigrationOfficial constructor', () => {
    test('should return user id', () => {
      const immigrationOfficial = new ImmigrationOfficial(new UserId('1a2b3c4d5e'), null);
      expect(immigrationOfficial.getId()).toEqual('1a2b3c4d5e');
    });
  });

  describe('integration test - ImmigrationOfficial connection to repository', () => {
    const repository = new ImmigrationOfficialRepository();
    const immigrationOfficial = new ImmigrationOfficial(new UserId('1234'), repository);

    test('GET /immigration-official/19965/patients', async () => {
      await immigrationOfficial.getAllPatients();
      expect(repository.viewAllPatients).toHaveBeenCalledTimes(1);
    });
  });

  it('should be able to get user covid info', async () => {
    const repo = new ImmigrationOfficialRepository('');
    const official = new ImmigrationOfficial(new UserId('1234'), repo);
    repo.viewUserCovidInformation.mockReturnValue('success');

    const info = await official.getUserCovidInfo('0987');

    expect(repo.viewUserCovidInformation).toHaveBeenCalledWith('1234', '0987');
    expect(info).toEqual('success');
  });

  it('should be able to get traveler info', async () => {
    const repo = new ImmigrationOfficialRepository('');
    const official = new ImmigrationOfficial(new UserId('1234'), repo);
    repo.viewTravelerProfile.mockReturnValue('success');

    const info = await official.getTravelerInfo('0987');

    expect(repo.viewTravelerProfile).toHaveBeenCalledWith('1234', '0987');
    expect(info).toEqual('success');
  });

  it('should be able to get traveler', async () => {
    const repo = new ImmigrationOfficialRepository('');
    const official = new ImmigrationOfficial(new UserId('1234'), repo);
    repo.fetchTraveler.mockReturnValue([{name: 'John Doe'}]);

    const info = await official.getTraveler();

    expect(repo.fetchTraveler).toHaveBeenCalledWith('1234');
    expect(info).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'John Doe',
        }),
      ]),
    );
  });
});
