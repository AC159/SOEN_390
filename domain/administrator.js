const User = require('./user');
const UserState = require('./user').UserState;

class Administrator {
  constructor(userId) {
    this.userId = userId;
  }

  viewDoctors() {
    throw new Error(`${this.viewDoctors.name} is not implemented.`);
  }

  async viewUsers(mongo) {
    const response = await mongo.db('test').collection('users').find({})
    return response.toArray();
  }

  async setUserRole(mongo, user, role) {
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