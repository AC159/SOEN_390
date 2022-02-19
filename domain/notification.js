class Notification {
    constructor(notificationId, notificationRepository) {
        this.notificationId = notificationId;
        this.notificationRepository = notificationRepository;
    }

    async createNotification(notificationData) {
        try {
            return await this.notificationRepository.addNewNotification(notificationData);
        } catch (e) {
            throw e;
        }
    }

    async removeNotification() {
        try {
            return await this.notificationRepository.deleteNotification(this.notificationId);
        } catch (e) {
            throw e;
        }
    }

    async viewNotification() {
        try {
            return await this.notificationRepository.getNotification(this.notificationId);
        } catch (e) {
            throw e;
        }
    }
}

module.exports = Notification;