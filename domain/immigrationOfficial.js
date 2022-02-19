class ImmigrationOfficial {
    constructor(userId, immigrationOfficialRepository) {
        this.userId = userId;
        this.immigrationOfficialRepository = immigrationOfficialRepository;
    }

    async raiseFlag(userId) {
        try {
            return await this.immigrationOfficialRepository.raiseFlag(this.userId, userId);
        } catch (e) {
            console.log('Can not raise flag on this user');
            throw e;
        }
    }

    async getUserCovidInfo(userId) {
        try {
            return await this.immigrationOfficialRepository.viewUserCovidInformation(this.userId, userId);
        } catch (e) {
            console.log('Can not get COVID information on this user');
            throw e;
        }
    }

    async getTravelerInfo(travelerId) {
        try {
            return await this.immigrationOfficialRepository.viewTravelerProfile(this.userId, travelerId);
        } catch (e) {
            console.log('Can not get travel information on this user');
            throw e;
        }
    }

    getId() {
        return this.userId;
    }
}

module.exports = ImmigrationOfficial;