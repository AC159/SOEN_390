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
    try {
      await this.verifyAdmin();
      return await this.adminRepository.fetchPendingDoctors(this.userId.getId());
    } catch (error) {
      throw error;
    }
  }

  async approveDoctor(doctorId) {
    try {
      await this.verifyAdmin();
      return await this.adminRepository.approveDoctor(doctorId, this.userId.getId());
    } catch (error) {
      throw error;
    }
  }

  async rejectDoctor(doctorId) {
    try {
      await this.verifyAdmin();
      return await this.adminRepository.rejectDoctor(doctorId, this.userId.getId());
    } catch (error) {
      throw error;
    }
  }

  async viewPatients() {
    try {
      await this.verifyAdmin();
      return await this.adminRepository.fetchPendingPatients(this.userId.getId());
    } catch (error) {
      throw error;
    }
  }

  async approvePatient(patientId) {
    try {
      await this.verifyAdmin();
      return await this.adminRepository.approvePatient(patientId, this.userId.getId());
    } catch (error) {
      throw error;
    }
  }

  async rejectPatient(patientId) {
    try {
      await this.verifyAdmin();
      return await this.adminRepository.rejectPatient(patientId, this.userId.getId());
    } catch (error) {
      throw error;
    }
  }

  async viewHealthOfficers() {
    try {
      await this.verifyAdmin();
      return await this.adminRepository.fetchPendingHealthOfficers(this.userId.getId());
    } catch (error) {
      throw error;
    }
  }

  async approveHealthOfficer(officerId) {
    try {
      await this.verifyAdmin();
      return await this.adminRepository.approveHealthOfficer(officerId, this.userId.getId());
    } catch (error) {
      throw error;
    }
  }

  async rejectHealthOfficer(officerId) {
    try {
      await this.verifyAdmin();
      return await this.adminRepository.rejectHealthOfficer(officerId, this.userId.getId());
    } catch (error) {
      throw error;
    }
  }

  async viewImmigrationOfficers() {
    try {
      await this.verifyAdmin();
      return await this.adminRepository.fetchPendingImmigrationOfficers(this.userId.getId());
    } catch (error) {
      throw error;
    }
  }

  async approveImmigrationOfficer(officerId) {
    try {
      await this.verifyAdmin();
      return await this.adminRepository.approveImmigrationOfficer(officerId, this.userId.getId());
    } catch (error) {
      throw error;
    }
  }

  async rejectImmigrationOfficer(officerId) {
    try {
      await this.verifyAdmin();
      return await this.adminRepository.rejectImmigrationOfficer(officerId, this.userId.getId());
    } catch (error) {
      throw error;
    }
  }

  assignPatient(patient, doctor) {
    throw new Error(`${this.assignPatient.name} is not implemented.`);
  }
}

module.exports = Administrator;