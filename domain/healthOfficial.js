class HealthOfficial {
  constructor(userId, healthOfficialRepository) {
    this.userId = userId;
    this.healthOfficialRepository = healthOfficialRepository;
  }

  async raiseFlag(userId) {
    return await this.healthOfficialRepository.raiseFlag(this.userId, userId);
  }

  async getUserCovidInfo(userId) {
    return await this.healthOfficialRepository.viewUserCovidInformation(this.userId, userId);
  }

  async getReportsFromUser(userId) {
    return await this.healthOfficialRepository.fetchReport(this.userId, userId);
  }

  async getContactListFromReport(reportId) {
    return await this.healthOfficialRepository.viewReportContacts(this.userId, reportId);
  }

  async getAllPatients() {
    return await this.healthOfficialRepository.viewAllPatients(this.userId);
  }

  getId() {
    return this.userId;
  }
}

module.exports = HealthOfficial;
