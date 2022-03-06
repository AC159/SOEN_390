class ImmigrationOfficialRepository {
  constructor(mongo) {
    this.mongo = mongo;
  }

  async verifyImmigrationOfficial(userId) {
    const immigrationOfficialData = this.mongo
        .db('test')
        .collection('user')
        .findOne(
            {userId: userId},
            {
              userType: 1,
              userStatus: 1,
            },
        );
    if (
      immigrationOfficialData.userType.toLowerCase() !==
        'immigrationOfficial' ||
      immigrationOfficialData.userStatus.toLowerCase() !== 'approved'
    ) {
      throw new Error('Not a valid immigration official');
    }
  }

  async raiseFlag(immigrationOfficialId, userId) {
    try {
      await this.verifyImmigrationOfficial(immigrationOfficialId);
      return this.mongo
          .db('test')
          .collection('user')
          .findOneAndUpdate({userId: userId}, {$set: {isFlagged: true}});
    } catch (e) {
      throw e;
    }
  }

  async viewUserCovidInformation(healthOfficialId, userId) {
    try {
      await this.verifyImmigrationOfficial(healthOfficialId);
      const profile = this.mongo
          .db('test')
          .collection('user')
          .findOne({userId: userId});
      // todo: not sure on which attributes to be selected, will change later on
      return profile;
    } catch (e) {
      throw e;
    }
  }

  async viewTravelerProfile(healthOfficialId, travelerId) {
    try {
      await this.verifyImmigrationOfficial(healthOfficialId);
      const travelerProfile = this.mongo
          .db('test')
          .collection('user')
          .findOne({userId: travelerId});
      // todo: not sure on which attributes to be selected, will discuss later
      return travelerProfile;
    } catch (e) {
      throw e;
    }
  }

  async viewAllPatients(immigrationOfficialId) {
    // await this.verifyImmigrationOfficial(immigrationOfficialId);
    return this.mongo
      .db('test')
      .collection('user')
      .find({
        userType: 'patient'
      })
      .toArray();
  }
}

module.exports = ImmigrationOfficialRepository;
