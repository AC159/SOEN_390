require('dotenv').config();
const nodemailer = require("nodemailer");

class Administrator {
  constructor(userId, adminRepository) {
    this.userId = userId;
    this.adminRepository = adminRepository;
  }

  async verifyAdmin() {
    await this.adminRepository.verifyAdmin(this.userId.getId());
  }

  async viewDoctors() {
    await this.verifyAdmin();
    return await this.adminRepository.fetchPendingUsers('doctor');
  }

  async viewPatients() {
    await this.verifyAdmin();
    return await this.adminRepository.fetchPendingUsers('patient');
  }

  async viewHealthOfficers() {
    await this.verifyAdmin();
    return await this.adminRepository.fetchPendingUsers('healthOfficer');
  }

  async viewImmigrationOfficers() {
    await this.verifyAdmin();
    return await this.adminRepository.fetchPendingUsers('immigrationOfficer');
  }

  async approvePendingUser(userId) {
    await this.verifyAdmin();
    return await this.adminRepository.approveUser(userId);

  }

  async rejectPendingUser(userId) {
    await this.verifyAdmin();
    return await this.adminRepository.rejectUser(userId);
  }

  assignPatient(patient, doctor) {
    throw new Error(`${this.assignPatient.name} is not implemented.`);
  }

  async sendConfirmationEmail(userEmail, message) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.COVICARE_EMAIL, // generated ethereal user
        pass: process.env.COVICARE_EMAIL_PASSWORD, // generated ethereal password
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: process.env.COVICARE_EMAIL, // sender address
      to: userEmail, // list of receivers
      subject: "CoviCare Account Confirmation ✔", // Subject line
      text: message, // plain text body
      // html: "<b>Hello world?</b>", // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    return info;
  }

}

module.exports = Administrator;
