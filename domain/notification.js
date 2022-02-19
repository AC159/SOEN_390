class Notification {
    constructor(notificationId, notificationRepository) {
        this.notificationId = notificationId;
        this.notificationRepository = notificationRepository;
    }

    async createNotification(notificationData) {
        return await this.notificationRepository.addNewNotification(notificationData);
    }

    async removeNotification() {
        return await this.notificationRepository.deleteNotification(this.notificationId);
    }

    async viewNotification() {
        return await this.notificationRepository.getNotification(this.notificationId);
    }

    getNotificationId() {
        return this.notificationId;
    }
}

module.exports.Notification = Notification;