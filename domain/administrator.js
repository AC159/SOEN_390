const UserState = require('./user').UserState;

class Administrator {
  constructor(userId, adminRepository) {
    this.userId = userId;
    this.adminRepository = adminRepository;
  }

  async viewDoctors() {
    try {
      return await this.adminRepository.fetchPendingDoctors(this.userId.getId());
    } catch (error) {
      throw error;
    }
  }

  async approveDoctor(doctorId) {
    try {
      return await this.adminRepository.approveDoctor(doctorId, this.userId.getId());
    } catch (error) {
      throw error;
    }
  }

  async rejectDoctor(doctorId) {
    try {
      return await this.adminRepository.rejectDoctor(doctorId, this.userId.getId());
    } catch (error) {
      throw error;
    }
  }

  async viewPatients() {
    try {
      return await this.adminRepository.fetchPendingPatients(this.userId.getId());
    } catch (error) {
      throw error;
    }
  }

  async approvePatient(patientId) {
    try {
      return await this.adminRepository.approvePatient(patientId, this.userId.getId());
    } catch (error) {
      throw error;
    }
  }

  async rejectPatient(patientId) {
    try {
      return await this.adminRepository.rejectPatient(patientId, this.userId.getId());
    } catch (error) {
      throw error;
    }
  }

  async viewHealthOfficers() {
    try {
      return await this.adminRepository.fetchPendingHealthOfficers(this.userId.getId());
    } catch (error) {
      throw error;
    }
  }

  async approveHealthOfficer(officerId) {
    try {
      return await this.adminRepository.approveHealthOfficer(officerId, this.userId.getId());
    } catch (error) {
      throw error;
    }
  }

  async rejectHealthOfficer(officerId) {
    try {
      return await this.adminRepository.rejectHealthOfficer(officerId, this.userId.getId());
    } catch (error) {
      throw error;
    }
  }

  async viewImmigrationOfficers() {
    try {
      return await this.adminRepository.fetchPendingImmigrationOfficers(this.userId.getId());
    } catch (error) {
      throw error;
    }
  }

  async approveImmigrationOfficer(officerId) {
    try {
      return await this.adminRepository.approveImmigrationOfficer(officerId, this.userId.getId());
    } catch (error) {
      throw error;
    }
  }

  async rejectImmigrationOfficer(officerId) {
    try {
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