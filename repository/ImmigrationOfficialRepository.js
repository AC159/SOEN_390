class ImmigrationOfficialRepository {
  constructor(mongo) {
    this.mongo = mongo;
  }

  verifyImmigrationOfficial(userId) {
    const immigrationOfficialData = this.mongo.db('test').collection('user').findOne(
      {userId: userId},
      {userType: 1, userStatus: 1});
    if (immigrationOfficialData.userType !== 'immigrationOfficial' ||
      immigrationOfficialData.userStatus !== 'approved') {
      throw new Error('Not a valid immigration official');
    }
  }

  async raiseFlag(immigrationOfficialId, userId) {
    await this.verifyImmigrationOfficial(immigrationOfficialId);
    return this.mongo
      .db('test')
      .collection('user')
      .findOneAndUpdate({userId: userId}, {$set: {isFlagged: true}});
  }

  async viewUserCovidInformation(healthOfficialId, userId) {
    await this.verifyImmigrationOfficial(healthOfficialId);
    // todo: not sure on which attributes to be selected, will change later on
    return this.mongo.db('test').collection('user').findOne({userId: userId});
  }

  async viewTravelerProfile(healthOfficialId, travelerId) {
    await this.verifyImmigrationOfficial(healthOfficialId);
    // todo: not sure on which attributes to be selected, will discuss later
    return this.mongo.db('test').collection('user').findOne({userId: travelerId});
  }

  async viewAllPatients(immigrationOfficialId) {
    await this.verifyImmigrationOfficial(immigrationOfficialId);
    return this.mongo.db('test').collection('user').find({userType: 'patient'}).toArray();
  }
}

module.exports = ImmigrationOfficialRepository;
