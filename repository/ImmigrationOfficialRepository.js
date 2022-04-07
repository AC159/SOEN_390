class ImmigrationOfficialRepository {
  constructor(mongo) {
    this.mongo = mongo;
  }

  async verifyImmigrationOfficial(userId) {
    const immigrationOfficialData = await this.mongo.db('test').collection('user').findOne({uid: userId}, {
      userType: 1,
      userStatus: 1,
    });
    if (immigrationOfficialData.userType !== 'immigrationOfficial' ||
      immigrationOfficialData.userStatus !== 'APPROVED') {
      throw new Error('Not a valid immigration official');
    }
  }

  async raiseFlag(immigrationOfficialId, userId, newFlagValue) {
    await this.verifyImmigrationOfficial(immigrationOfficialId);
    let newId;
    if (newFlagValue === true) newId = immigrationOfficialId;
    else newId = '';
    return this.mongo
        .db('test')
        .collection('user')
        .updateOne({uid: userId},
            {$set: {immigrationOfficerFlagInfo: {isFlagged: newFlagValue, flaggingUser: newId}}});
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



  fetchTraveler(userId) {
    return this.mongo.db('test').collection('travelers').find({patientUid: userId}).sort({date: -1}).toArray();
  }


 
}

module.exports = ImmigrationOfficialRepository;
