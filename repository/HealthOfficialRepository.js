class HealthOfficialRepository {
  constructor(mongo) {
    this.mongo = mongo;
  }

  async verifyHealthOfficial(userId) {
    const healthOfficialData = this.mongo.db('test').collection('user')
      .findOne({userId: userId}, {userType: 1, userStatus: 1});
    if (healthOfficialData.userType !== 'healthOfficer' ||
      healthOfficialData.userStatus !== 'approved') {
      throw new Error('Not a valid health official');
    }
  }

  async viewUserCovidInformation(healthOfficialId, userId) {
    await this.verifyHealthOfficial(healthOfficialId);
    // todo: not sure on which attributes to be selected, will change later on
    return this.mongo.db('test').collection('user').findOne({userId: userId});
  }

  async fetchReport(healthOfficialId, userId) {
    await this.verifyHealthOfficial(healthOfficialId);
    // todo: fetch reports of the user from report collection?
  }

  async viewReportContacts(healthOfficialId, reportId) {
    await this.verifyHealthOfficial(healthOfficialId);
    // todo: fetch report
    // todo: fetch list of users in the report?
  }

  async raiseFlag(healthOfficialId, userId) {
    await this.verifyHealthOfficial(healthOfficialId);
    return this.mongo.db('test').collection('user').findOneAndUpdate({userId: userId}, {$set: {isFlagged: true}});
  }

  async viewAllPatients(healthOfficialId) {
    // await this.verifyHealthOfficial(healthOfficialId);
    return this.mongo.db('test').collection('user').find({userType: 'patient'}).toArray();
  }
}

module.exports = HealthOfficialRepository;
