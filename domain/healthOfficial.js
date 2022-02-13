class healthOfficial {
    constructor(userId, healthOfficialRepository) {
        this.userId = userId;
        this.healthOfficialRepository = healthOfficialRepository;
    }

    async raiseFlag(userId) {
        try {
            return await this.healthOfficialRepository.raiseFlag(this.userId, userId);
        } catch (e) {
            throw new Error('Can not raise flag on this user');
        }
    }

    async getUserCovidInfo(userId) {
        try {
            return await this.healthOfficialRepository.viewUserCovidInformation(this.userId, userId);
        } catch (e) {
            throw new Error('Can not get COVID information on this user');
        }
    }

    async getReportsFromUser(userId) {
        try {
            return await this.healthOfficialRepository.fetchReport(this.userId, userId);
        } catch (e) {
            throw new Error('Can not get reports from this user');
        }
    }

    async getContactListFromReport(reportId) {
        try {
            return await this.healthOfficialRepository.viewReportContacts(this.userId, reportId);
        } catch (e) {
            throw new Error('Can not get contact list from this report');
        }
    }
}