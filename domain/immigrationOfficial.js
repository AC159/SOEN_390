class ImmigrationOfficial {
  constructor(userId, immigrationOfficialRepository) {
    this.userId = userId;
    this.immigrationOfficialRepository = immigrationOfficialRepository;
  }

  async raiseFlag(userId, newFlagValue) {
    return await this.immigrationOfficialRepository.raiseFlag(this.userId.getId(), userId, newFlagValue);
  }

  async getUserCovidInfo(userId) {
    return await this.immigrationOfficialRepository.viewUserCovidInformation(this.userId, userId);
  }

  async getTravelerInfo(travelerId) {
    return await this.immigrationOfficialRepository.viewTravelerProfile(this.userId, travelerId);
  }

  async getAllPatients() {
    return await this.immigrationOfficialRepository.viewAllPatients(this.userId.getId());
  }

  getId() {
    return this.userId;
  }
}

module.exports.ImmigrationOfficial = ImmigrationOfficial;
