class Doctor {
  constructor(userId, doctorRepository) {
    this.id = userId;
    this.doctorRepository = doctorRepository;
  }

  async verifyDoctor() {
    await this.doctorRepository.verifyDoctor(this.id.getId());
  }

  async getPatientArrays() {
    const patients = await this.doctorRepository.getPatients(this.id.getId());
    return await Promise.all(
      await patients.map(async (patient) => {
        const status = await this.doctorRepository.getPatientStatus(patient.uid);
        return await {
          ...patient,
          status: status === null ? 'Not tested' : status.covidStatus,
        };
      }),
    );
  }

  async getPatients() {
    return this.doctorRepository.getPatients(this.id.getId());
  }

  async raiseFlag(userId, newFlagValue) {
    return await this.doctorRepository.raiseFlag(this.id.getId(), userId, newFlagValue);
  }

  async postQuestions(formData) {
    return await this.doctorRepository.storeQuestions(formData);
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
