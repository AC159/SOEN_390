class DoctorRepository {
  constructor(mongo) {
    this.mongo = mongo;
  }

  getPatients(doctorId) {
    return this.mongo.db('test').collection('user')
        .find({'userType': 'patient', 'patientInfo.doctorId': doctorId})
        .project({_id: 0, name: 1, dob: 1, phoneNumber: 1, email: 1, uid: 1, patientInfo: 1})
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
}

module.exports = DoctorRepository;
