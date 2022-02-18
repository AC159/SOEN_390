
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

  async assignPatient(patient, doctor) {
    await this.verifyAdmin();
    const response = await this.adminRepository.assignPatient(patient, doctor);

    if (response.value?.patientInfo?.doctor !== doctor) {
      this.adminRepository.incrementDoctorPatientCount(doctor);
    }
  }

  async viewUnassignedPatient() {
    await this.verifyAdmin();
    return await this.adminRepository.fetchPatients();
  }

  async fetchDoctorProfiles() {
    await this.verifyAdmin();
    const response = await this.adminRepository.fetchDoctors();

    return response.map((doctor) => ({
      'uid': doctor.uid,
      'name': doctor.name,
      'address': doctor.address,
      'patientCount': doctor.doctorInfo.patientCount,
    }));
  }
}

module.exports = Administrator;
