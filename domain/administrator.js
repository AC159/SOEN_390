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
      return await this.adminRepository.fetchPendingUsers('doctor');
  }

  async approveDoctor(doctorId) {
      await this.verifyAdmin();
      return await this.adminRepository.approveUser(doctorId);
  }

  async rejectDoctor(doctorId) {
      await this.verifyAdmin();
      return await this.adminRepository.rejectDoctor(doctorId, this.userId.getId());
  }

  async viewPatients() {
      await this.verifyAdmin();
      return await this.adminRepository.fetchPendingUsers('patient');
  }

  async approvePatient(patientId) {
      await this.verifyAdmin();
      return await this.adminRepository.approveUser(patientId);
  }

  async rejectPatient(patientId) {
      await this.verifyAdmin();
      return await this.adminRepository.rejectPatient(patientId, this.userId.getId());
  }

  async viewHealthOfficers() {
      await this.verifyAdmin();
      return await this.adminRepository.fetchPendingUsers('healthOfficer');
  }

  async approveHealthOfficer(officerId) {
      await this.verifyAdmin();
      return await this.adminRepository.approveUser(officerId);
  }

  async rejectHealthOfficer(officerId) {
      await this.verifyAdmin();
      return await this.adminRepository.rejectHealthOfficer(officerId, this.userId.getId());
  }

  async viewImmigrationOfficers() {
      await this.verifyAdmin();
      return await this.adminRepository.fetchPendingUsers('immigrationOfficer');
  }

  async approveImmigrationOfficer(officerId) {
      await this.verifyAdmin();
      return await this.adminRepository.approveUser(officerId);
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