
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

  raiseFlag(userId, flagType, flagValue) {
    return this.mongo.db('test').collection('user').updateOne({uid: userId}, {$set: {flagType: flagValue}});
  }

  fetchPatientsCovidInfo() {
    return this.mongo.db('test').collection('user').find({userType: 'patient', userStatus: 'APPROVED'}, {_id: 0, uid: 1, covidStatus: 1, name: 1}).toArray();
  }

}

module.exports = PatientRepository;
