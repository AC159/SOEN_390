const {ObjectId} = require("mongodb");

class PatientRepository {
  constructor(mongo) {
    this.mongo = mongo;
  }

  async verifyOfficial(officialUid) {
    const officialData = await this.mongo.db('test').collection('user').findOne({uid: officialUid}, {userType: 1, userStatus: 1});
    console.log('Official data: ', officialData);
    if (officialData === null || officialData === undefined) {
      throw new Error('Not a valid official');
    } else if ((officialData.userType.toLowerCase() !== 'immigrationOfficial' || officialData.userStatus.toLowerCase() !== 'approved')
        && (officialData.userType.toLowerCase() !== 'healthOfficial' || officialData.userStatus.toLowerCase() !== 'approved')) {
      throw new Error('Not a valid official');
    }
  }

  async addStatusForm(formData) {
    // Add a timestamp in seconds to the patient form
    await this.mongo.db('test').collection('user').updateOne({uid: formData.patientUid}, {$set: {covidStatus: formData.covidStatus}})
    formData['timestamp'] = Math.floor(Date.now() / 1000);
    return this.mongo.db('test').collection('patientForms').insertOne({...formData});
  }

  updateStatusForm(formData) {
    const mongoId = ObjectId(formData._id);
    delete formData.patientUid;
    delete formData._id;
    return this.mongo.db('test').collection('patientForms').updateOne({_id: mongoId}, {$set: formData});
  }

  fetchPatientStatusForms(userId) {
    return this.mongo.db('test').collection('patientForms').find({patientUid: userId}).toArray();
  }

  raiseFlag(userId, flagType, flagValue) {
    return this.mongo.db('test').collection('user').updateOne({uid: userId}, {$set: {flagType: flagValue}});
  }

  fetchPatientsCovidInfo() {
    return this.mongo.db('test').collection('user').find({userType: 'patient', userStatus: 'APPROVED'}, {_id: 0, uid: 1, covidStatus: 1, name: 1}).toArray();
  }

  addContactTracingReport(ctrData) {
    return this.mongo.db('test').collection('contactTracing').insertOne({...ctrData});
  }

  fetchContactTracingReports(userId) {
    return this.mongo.db('test').collection('contactTracing').find({patientUid: userId}).toArray();
  }
}

module.exports = PatientRepository;
