const User = require('./user');

class Administrator {
  constructor(userId) {
    super(userId);
  }

  viewDoctors() {
    throw new Error(`${this.viewDoctors.name} is not implemented.`);
  }

  viewUsers() {
    throw new Error(`${this.viewDoctors.name} is not implemented.`);
  }

  setUserRole(user, role) {
    throw new Error(`${this.updateStatus.name} is not implemented.`);
  }

  assignPatient(patient, doctor) {
    throw new Error(`${this.assignPatient.name} is not implemented.`);
  }
}

module.exports = Administrator;