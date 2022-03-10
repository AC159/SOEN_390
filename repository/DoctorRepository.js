class DoctorRepository {
  constructor(mongo) {
    this.mongo = mongo;
  }

  async verifyDoctor(userId) {
    console.log("userId:"+userId);
    const doctorData = await this.mongo.db('test').collection('user')
      .findOne({uid: userId}, {userType: 1, userStatus: 1});
    
    if (doctorData === null || doctorData === undefined) {
      throw new Error('Not a valid doctor');
    }
  }

  getPatients(doctorId) {
    return this.mongo.db('test').collection('user')
        .find({'userType': 'patient', 'patientInfo.doctorId': doctorId})
        .project({_id: 0, name: 1, dob: 1, phoneNumber: 1, email: 1, uid: 1, patientInfo: 1, doctorFlagInfo: 1})
        .toArray();
  }

  getPatientStatus(patientId) {
    return this.mongo.db('test').collection('patientForms')
        .find({patientUid: patientId})
        .sort({timestamp: -1})
        .limit(1)
        .project({_id: 0, covidStatus: 1})
        .next();
  }

  async raiseFlag(doctorId, userId, newFlagValue) {
    await this.verifyDoctor(doctorId);

    var newId;
    if(newFlagValue === true) newId = doctorId
    else newId = "";
    return await this.mongo.db('test')
    .collection('user')
    .updateOne({uid: userId}, {$set: {doctorFlagInfo: {isFlagged: newFlagValue, flaggingUser: newId}}});
    
  }
}

module.exports = DoctorRepository;
