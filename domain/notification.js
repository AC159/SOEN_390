const nodemailer = require("nodemailer");

class Notification {
  constructor(notificationId, notificationRepository) {
    this.notificationId = notificationId;
    this.notificationRepository = notificationRepository;
  }

  async createNotification(notificationData, email) {
    const response = await this.notificationRepository.addNewNotification(notificationData);
    const emailResponse = await this.sendNewNotificationEmail(email);
    return {response, emailResponse};
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

  async sendNewNotificationEmail(userEmail) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.COVICARE_EMAIL, // generated ethereal user
        pass: process.env.COVICARE_EMAIL_PASSWORD, // generated ethereal password
      },
    });

    const info = await transporter.sendMail({
      from: process.env.COVICARE_EMAIL,
      to: userEmail,
      subject: 'CoviCare New Notification !',
      text: 'Hi. This email is to inform that you just received a new notification. Please log in as soon as possible to see the message.'
    });

    console.log('Message sent: ', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    return info;
  }

  getNotificationId() {
    return this.notificationId._id;
  }
}

module.exports.Notification = Notification;
