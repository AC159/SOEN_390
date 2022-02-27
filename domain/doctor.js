class Doctor {
  constructor(userId, doctorRepository) {
    this.id = userId;
    this.doctorRepository = doctorRepository;
  }

  async getPatients() {
    const patients = await this.doctorRepository.getPatients(this.id.getId());
    return await Promise.all(patients.map(async (patient) => {
      const status = await this.doctorRepository.getPatientStatus(patient.uid);
      return await {
        ...patient,
        status: status.covidStatus,
      };
    }));
  }

  getPatientFile(patient) {
    throw new Error(`${this.getPatientFile.name} is not implemented.`);
  }

  viewPatient(patient) {
    throw new Error(`${this.viewPatient.name} is not implemented.`);
  }

  flagPatient(patient) {
    throw new Error(`${this.flagPatient.name} is not implemented.`);
  }

  createAppointment(patient, date) {
    throw new Error(`${this.createAppointment.name} is not implemented.`);
  }

  createForm() {
    throw new Error(`${this.createForm.name} is not implemented.`);
  }

  uploadLiscence(license) {
    throw new Error(`${this.uploadLiscence.name} is not implemented.`);
  }
}

class License {
  constructor(id) {
    this.#setLicenseId(id);
  }

  #setLicenseId(id) {
    // Validate license
    this.id = id;
  }

  getLicense() {
    return this.id;
  }
}

module.exports = Doctor;
module.exports.License = License;
