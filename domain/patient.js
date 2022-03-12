const {User} = require('./user');

class Patient extends User {
  constructor(
      userId,
      name,
      address,
      phoneNumber,
      dob,
      userStatus = PatientStatus.Unconfirmed,
      isFlagged = false,
      patientRepository,
  ) {
    super(userId, name);
    this.userStatus = userStatus;
    this.isFlagged = isFlagged;
    this.phoneNumber = phoneNumber;
    this.dob = dob;
    this.address = address;
    this.patientRepository = patientRepository;
  }

  async verifyOfficial(officialUid) {
    await this.patientRepository.verifyOfficial(officialUid);
  }

  async postStatusForm(formData) {
    return await this.patientRepository.addStatusForm(formData);
  }

  async updateStatusForm(formData) {
    return await this.patientRepository.updateStatusForm(formData);
  }

  async getPatientStatusForms() {
    return await this.patientRepository.fetchPatientStatusForms(this.id.getId());
  }

  async raiseFlag(flagType, flagValue) {
    return await this.patientRepository.raiseFlag(this.id.getId(), flagType, flagValue);
  }

  async getPatientsCovidInfo(officialUid) {
    await this.verifyOfficial(officialUid);
    return await this.patientRepository.fetchPatientsCovidInfo();
  }

  async postContactTracingReport(ctrData) {
    return await this.patientRepository.addContactTracingReport(ctrData);
  }

  async getContactTracingReports() {
    return await this.patientRepository.fetchContactTracingReports(this.id.getId());
  }

  updateProfile() {
    throw new Error(`${this.updateProfile.name} is not implemented.`);
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
  #status;

  constructor(code, status) {
    this.#status = status;

    switch (code) {
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

class Address {
  #civicNumber;
  #street;
  #postalCode;
  #city;
  #province;

  constructor(civicNumber, street, postalCode, city, province) {
    this.#setCivicNumber(civicNumber);
    this.#setStreet(street);
    this.#setPostalCode(postalCode);
    this.#setCity(city);
    this.#setProvince(province);
  }

  #setCivicNumber(civicNumber) {
    // validate civic number
    this.#civicNumber = civicNumber;
  }

  #setStreet(street) {
    // validate stree name
    this.#street = street;
  }

  #setPostalCode(postalCode) {
    // validate postal code
    this.#postalCode = postalCode;
  }

  #setCity(city) {
    // validate city
    this.#city = city;
  }

  #setProvince(province) {
    // validate province
    this.#province = province;
  }

  getCivicNumber() {
    return this.#civicNumber;
  }

  getStreet() {
    return this.#street;
  }

  getPostalCode() {
    return this.#postalCode;
  }

  getCity() {
    return this.#city;
  }

  getProvince() {
    return this.#province;
  }

  getAddress() {
    return `${this.#civicNumber} ${this.#street}, ${this.#city} (${
      this.#province
    }), ${this.#postalCode}`;
  }
}

module.exports = Patient;
module.exports.PatientStatus = PatientStatus;
module.exports.Address = Address;
