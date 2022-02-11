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

  async approvePatient(patientId) {
    try {
      return await this.adminRepository.approvePatient(patientId, this.userId);
    } catch (error) {
      throw error;
    }
  }

  assignPatient(patient, doctor) {
    throw new Error(`${this.assignPatient.name} is not implemented.`);
  }
}

module.exports = Administrator;