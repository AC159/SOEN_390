class DoctorRepository {
  constructor(mongo) {
    this.mongo = mongo;
  }

  async verifyDoctor(doctorId) {
    return await this.mongo.db('test')
        .collection('user')
        .findOne({uid: doctorId}, {_id: 0, userType: 1, userStatus: 1});
  }

  getPatients(doctorId) {
    return this.mongo.db('test').collection('user')
        .find({'userType': 'patient', 'patientInfo.doctorId': doctorId})
        .project({_id: 0, name: 1, dob: 1, phoneNumber: 1, email: 1, uid: 1})
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

  // getPatientInfo(patientId) {
  //   return this.mongo.db('test').collection('user')
  //       .find({uid: patientId});
  // }

  insertAppointment(appointment) {
    return this.mongo.db('test')
        .collection('appointment')
        .insertOne(appointment);
  }

  insertNotification(notification) {
    return this.mongo.db('test')
        .collection('notification')
        .insertOne(notification);
  }
}

module.exports = DoctorRepository;
