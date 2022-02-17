const UserState = require("./user").UserState;

class Administrator {
  constructor(userId, adminRepository) {
    this.userId = userId;
    this.adminRepository = adminRepository;
  }

  async viewDoctors() {
    try {
      return await this.adminRepository.fetchPendingDoctors(this.userId);
    } catch (error) {
      throw error;
    }
  }

  async approveDoctor(doctorId) {
    try {
      return await this.adminRepository.approveDoctor(doctorId, this.userId);
    } catch (error) {
      throw error;
    }
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
