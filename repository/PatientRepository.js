const {ObjectId} = require("mongodb");

class PatientRepository {
  constructor(mongo) {
    this.mongo = mongo;
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
}

module.exports = PatientRepository;
