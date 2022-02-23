class HealthOfficialRepository {
  constructor(mongo) {
    this.mongo = mongo;
  }

  async verifyHealthOfficial(userId) {
    const healthOfficialData = this.mongo.db('test').collection('user').findOne(
        {userId: userId},
        {
          userType: 1,
          userStatus: 1,
        },
    );
    if (
      healthOfficialData.userType.toLowerCase() !== 'healthOfficer' ||
      healthOfficialData.userStatus.toLowerCase() !== 'approved'
    ) {
      throw new Error('Not a valid health official');
    }
  }

  async viewUserCovidInformation(healthOfficialId, userId) {
    try {
      await this.verifyHealthOfficial(healthOfficialId);
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

  async fetchReport(healthOfficialId, userId) {
    try {
      await this.verifyHealthOfficial(healthOfficialId);
      // todo: fetch reports of the user from report collection?
    } catch (e) {
      throw e;
    }
  }

  async viewReportContacts(healthOfficialId, reportId) {
    try {
      await this.verifyHealthOfficial(healthOfficialId);
      // todo: fetch report
      // todo: fetch list of users in the report?
    } catch (e) {
      throw e;
    }
  }

  async raiseFlag(healthOfficialId, userId) {
    try {
      await this.verifyHealthOfficial(healthOfficialId);
      return this.mongo
          .db('test')
          .collection('user')
          .findOneAndUpdate({userId: userId}, {$set: {isFlagged: true}});
    } catch (e) {
      throw e;
    }
  }
}

module.exports = HealthOfficialRepository;
