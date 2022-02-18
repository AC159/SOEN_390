
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

  async viewPatients() {
      await this.verifyAdmin();
      return await this.adminRepository.fetchPendingUsers('patient');
  }

  async viewHealthOfficers() {
      await this.verifyAdmin();
      return await this.adminRepository.fetchPendingUsers('healthOfficer');
  }

  async viewImmigrationOfficers() {
      await this.verifyAdmin();
      return await this.adminRepository.fetchPendingUsers('immigrationOfficer');
  }

  async approvePendingUser(userId) {
      await this.verifyAdmin();
      return await this.adminRepository.approveUser(userId);
  }

  async rejectPendingUser(userId) {
      await this.verifyAdmin();
      return await this.adminRepository.rejectUser(userId);
  }

  assignPatient(patient, doctor) {
    throw new Error(`${this.assignPatient.name} is not implemented.`);
  }
}

module.exports = Administrator;
