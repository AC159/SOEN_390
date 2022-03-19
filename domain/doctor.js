class Doctor {
  constructor(userId, doctorRepository) {
    this.id = userId;
    this.doctorRepository = doctorRepository;
  }

  async verifyDoctor() {
    await this.doctorRepository.verifyDoctor(this.id.getId());
  }

  async getPatients() {
    return this.doctorRepository.getPatients(this.id.getId());
    const patients = await this.doctorRepository.getPatients(this.id.getId());
    console.log('Patients 1: ', patients);
    return await Promise.all(patients.map(async (patient) => {
      const status = await this.doctorRepository.getPatientStatus(patient.uid);
      return await {
        ...patient,
        status: status === null ? 'Not tested' : status.covidStatus,
      };
    }));
  }

  async raiseFlag(userId, newFlagValue) {
    return await this.doctorRepository.raiseFlag(this.id.getId(), userId, newFlagValue);
  }

  async postQuestions(formData) {
    return await this.doctorRepository.storeQuestions(formData);
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

  async createAppointment(patientId, appointmentInfo) {
    this.verifyDoctor();
    const appointment = {
      ...appointmentInfo,
      patientId,
      doctorId: this.id.getId(),
    };
    const response = await this.doctorRepository.insertAppointment(appointment);
    if (!response.acknowledged) {
      throw new Error('The appointment was not saved.');
    }

    const notification = {
      type: 'primary',
      heading: appointmentInfo.title,
      mainText: appointmentInfo.information,
      subText: appointmentInfo.meetingLink,
      timeStamp: Date.now(),
      userId: patientId,
    };
    await this.doctorRepository.insertNotification(notification);
  }

  async getAppointments() {
    this.verifyDoctor();
    return await this.doctorRepository.findAppointments(this.id.getId());
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
