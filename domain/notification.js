class Notification {
  constructor(notificationId, notificationRepository) {
    this.notificationId = notificationId;
    this.notificationRepository = notificationRepository;
  }

  async createNotification(notificationData) {
    const response = await this.notificationRepository.addNewNotification(notificationData);
    await this.sendNewNotificationEmail();
    return response;
  }

  async createManyNotifications(notificationData) {
    return await this.notificationRepository.addManyNotifications(notificationData);
  }

  async removeNotification() {
    return await this.notificationRepository.deleteNotification(this.notificationId);
  }

  async viewNotification() {
    return await this.notificationRepository.getNotification(this.notificationId);
  }

  async sendNewNotificationEmail() {

  }

  getNotificationId() {
    return this.notificationId._id;
  }
}

module.exports.Notification = Notification;
