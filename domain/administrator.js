const UserState = require('./user').UserState;

class Administrator {
  constructor(userId, adminRepository) {
    this.userId = userId;
    this.adminRepository = adminRepository;
  }

  viewDoctors() {
    throw new Error(`${this.viewDoctors.name} is not implemented.`);
  }

  async viewPatients() {
    try {
      return await this.adminRepository.fetchPendingPatients(this.userId);
    } catch (error) {
      throw error;
    }
  }

  async setUserRole(mongo, user, role) {
    console.log("object")
    console.log(user.id.getId())
    const response = await mongo.db('test')
      .collection('users')
      .updateOne({ userId: user.id.getId() }, { $set: { 
        role: role.getRole(),
        roleStatus: UserState.Approved.getState()
      }});

    return response;
  }

  assignPatient(patient, doctor) {
    throw new Error(`${this.assignPatient.name} is not implemented.`);
  }
}

module.exports = Administrator;