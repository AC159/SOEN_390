const UserState = require('./user').UserState;

class Administrator {

  constructor(userId, adminRepository) {
    this.userId = userId;
    this.adminRepository = adminRepository;
  }

  async verifyAdmin() {
    await this.adminRepository.verifyAdmin(this.userId.getId());
  }

  async viewDoctors() {
      await this.verifyAdmin();
      return await this.adminRepository.fetchPendingDoctors(this.userId.getId());
  }

  async approveDoctor(doctorId) {
      await this.verifyAdmin();
      return await this.adminRepository.approveDoctor(doctorId, this.userId.getId());
  }

  async rejectDoctor(doctorId) {
      await this.verifyAdmin();
      return await this.adminRepository.rejectDoctor(doctorId, this.userId.getId());
  }

  async viewPatients() {
      await this.verifyAdmin();
      return await this.adminRepository.fetchPendingPatients(this.userId.getId());
  }

  async approvePatient(patientId) {
      await this.verifyAdmin();
      return await this.adminRepository.approvePatient(patientId, this.userId.getId());
  }

  async rejectPatient(patientId) {
      await this.verifyAdmin();
      return await this.adminRepository.rejectPatient(patientId, this.userId.getId());
  }

  async viewHealthOfficers() {
      await this.verifyAdmin();
      return await this.adminRepository.fetchPendingHealthOfficers(this.userId.getId());
  }

  async approveHealthOfficer(officerId) {
      await this.verifyAdmin();
      return await this.adminRepository.approveHealthOfficer(officerId, this.userId.getId());
  }

  async rejectHealthOfficer(officerId) {
      await this.verifyAdmin();
      return await this.adminRepository.rejectHealthOfficer(officerId, this.userId.getId());
  }

  async viewImmigrationOfficers() {
      await this.verifyAdmin();
      return await this.adminRepository.fetchPendingImmigrationOfficers(this.userId.getId());
  }

  async approveImmigrationOfficer(officerId) {
      await this.verifyAdmin();
      return await this.adminRepository.approveImmigrationOfficer(officerId, this.userId.getId());
  }

  async rejectImmigrationOfficer(officerId) {
      await this.verifyAdmin();
      return await this.adminRepository.rejectImmigrationOfficer(officerId, this.userId.getId());
  }

  assignPatient(patient, doctor) {
    throw new Error(`${this.assignPatient.name} is not implemented.`);
  }
}

module.exports = Administrator;