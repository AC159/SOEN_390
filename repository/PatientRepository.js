const {ObjectId} = require("mongodb");

class PatientRepository {
  constructor(mongo) {
    this.mongo = mongo;
  }

  addStatusForm(formData) {
    // Add a timestamp in seconds to the patient form
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
