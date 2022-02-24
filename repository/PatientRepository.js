
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
    const patientUid = formData.patientUid;
    delete formData.patientUid;
    return this.mongo.db('test').collection('patientForms').updateOne({patientUid: patientUid}, {$set: formData});
  }

  fetchPatientForm(userId) {
    return this.mongo.db('test').collection('patientForms').findOne({patientUid: userId});
  }
}

module.exports = PatientRepository;
