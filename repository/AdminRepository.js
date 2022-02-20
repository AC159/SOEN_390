
class AdminRepository {
  constructor(mongo) {
    this.mongo = mongo;
  }

  async verifyAdmin(adminId) {
    console.log('AdminId: ', adminId);
    const adminData = await this.mongo.db('test').collection('user').findOne({uid: adminId}, {userType: 1, userStatus: 1});
    console.log('adminData: ', adminData);
    if (adminData === null || adminData === undefined) {
      throw new Error('Not a valid administrator');
    } else if (adminData.userType.toLowerCase() !== 'administrator' || adminData.userStatus.toLowerCase() !== 'approved') {
      throw new Error('Not a valid administrator');
    }
  }

  async fetchPendingUsers(userType) {
    // userType can be either administrator, doctor, immigrationOfficer, healthOfficer or patient
    // todo: implement pagination for many users?
    const response = await this.mongo.db('test').collection('user').find({userType: userType, userStatus: 'PENDING'}, {name: 1, email: 1});
    return response.toArray();
  }

  async approveUser(userId) {
    return await this.mongo.db('test').collection('user').updateOne({uid: userId}, {$set: {userStatus: 'APPROVED'}});
  }

  async rejectUser(userId) {
    return await this.mongo.db('test').collection('user').updateOne({uid: userId}, {$set: {userStatus: 'REJECTED'}});
  }

  async fetchPatients() {
    return await this.mongo.db('test').collection('user')
        .find({
          userType: 'patient',
          userStatus: 'APPROVED'})
          //patientInfo: {doctor: null}})
        .project({_id: 0, uid: 1, name: 1, dob: 1, address: 1, patientInfo: 1})
        .toArray();
  }

  async fetchDoctors() {
    return await this.mongo.db('test').collection('user')
        .find({
          userType: 'doctor',
          userStatus: 'APPROVED',
        })
        .project({
          _id: 0,
          uid: 1,
          name: 1,
          address: 1,
          doctorInfo: 1,
        })
        .toArray();
  }

  async assignPatient(patientId, doctorId, doctorName) {
    return await this.mongo.db('test')
        .collection('user')
        .findOneAndUpdate(
            {uid: patientId},
            {$set: {
              patientInfo: {
                doctor: doctorName,
              },
            }});
  }

  async incrementDoctorPatientCount(doctorId) {
    return await this.mongo.db('test')
        .collection('user')
        .updateOne(
            {uid: doctorId},
            {$inc: {'doctorInfo.patientCount': 1}},
        )
        .catch((error) => {
          throw (error);
        });
  }

  async decrementDoctorPatientCount(doctorId) {
    return await this.mongo.db('test')
        .collection('user')
        .updateOne(
            {uid: doctorId},
            {$inc: {'doctorInfo.patientCount': -1}},
        )
        .catch((error) => {
          throw (error);
        });
  }
}

module.exports = AdminRepository;
