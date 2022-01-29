class Patient {
  constructor(status) {
    this.status = status
  }

  updateStatus(medicalForm) {
    throw new Error(`${this.updateStatus.name} is not implemented.`);
  }

  messageDoctor(doctorId, message) {
    throw new Error(`${this.messageDoctor.name} is not implemented.`);
  }

  setMessagePriority(message) {
    throw new Error(`${this.setMessagePriority.name} is not implemented.`);
  }

  addCovidContact(contact) {
    throw new Error(`${this.addCovidContact.name} is not implemented.`);
  }

  get quarantineEndDate() {
    throw new Error(`${this.quarantineEndDate.name} is not implemented.`);
  }
}

class PatientStatus {
  static Confirmed = new PatientStatus(0, 'confirmed');
  static Unconfirmed = new PatientStatus(1, 'unconfirmed');
  static Healthy = new PatientStatus(2, 'healthy');

  #isConfirmed = false;
  #isUnconfirmed = false;
  #isHealthy = false;
  #status

  constructor(code, status) {
    this.#status = status;

    switch(code) {
      case 0:
        this.#isConfirmed = true;
        break;
      case 1:
        this.#isUnconfirmed = true;
        break;
      case 2:
        this.#isHealthy = true;
    }
  }

  getStatus() {
    return this.#status;
  }

  isHealthy() {
    return this.#isHealthy;
  }

  isConfirmed() {
    return this.#isConfirmed;
  }

  isUnconfirmed() {
    return this.#isUnconfirmed;
  }
}

module.exports = Patient;
module.exports.PatientStatus = PatientStatus;