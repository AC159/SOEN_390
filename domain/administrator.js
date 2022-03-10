require('dotenv').config();
const nodemailer = require('nodemailer');

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
    return await this.adminRepository.fetchPendingUsers('healthOfficial');
  }

  async viewImmigrationOfficers() {
    await this.verifyAdmin();
    return await this.adminRepository.fetchPendingUsers('immigrationOfficial');
  }

  async approvePendingUser(userId) {
    await this.verifyAdmin();
    const user = await this.adminRepository.approveUser(userId);
    switch (user.value.userType) {
      case 'patient':
        this.adminRepository.setUserDefaultInformation(userId, {patientInfo: {doctor: ''}, 
        doctorFlagInfo: {isFlagged: false, flaggingUser: ""},
        immigrationOfficerFlagInfo: {isFlagged: false, flaggingUser: ""},
        healthOfficialFlagInfo: {isFlagged: false, flaggingUser: ""}});
        break;
      case 'doctor':
        this.adminRepository.setUserDefaultInformation(userId, {doctorInfo: {patientCount: 0}});
        break;
      default:
        break;
    }

    return user.value;
  }

  async rejectPendingUser(userId) {
    await this.verifyAdmin();
    return await this.adminRepository.rejectUser(userId);
  }

  async assignPatient(patient, doctorId, doctorName) {
    await this.verifyAdmin();
    const response = await this.adminRepository.assignPatient(patient, doctorId, doctorName);
    const oldDoctorId = response.value?.patientInfo?.doctorId;

    if (oldDoctorId !== doctorId) {
      if (oldDoctorId !== null && oldDoctorId !== undefined) {
        await this.adminRepository.decrementDoctorPatientCount(oldDoctorId);
      }
      await this.adminRepository.incrementDoctorPatientCount(doctorId);
    }
  }

  async viewUnassignedPatient() {
    await this.verifyAdmin();
    return await this.adminRepository.fetchPatients();
  }

  async fetchDoctorProfiles() {
    await this.verifyAdmin();
    const response = await this.adminRepository.fetchDoctors();

    return response.map((doctor) => ({
      'uid': doctor.uid,
      'name': doctor.name,
      'address': doctor.address,
      'patientCount': doctor.doctorInfo.patientCount,
    }));
  }

  async sendConfirmationEmail(userEmail, message) {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.COVICARE_EMAIL, // generated ethereal user
        pass: process.env.COVICARE_EMAIL_PASSWORD, // generated ethereal password
      },
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: process.env.COVICARE_EMAIL, // sender address
      to: userEmail, // list of receivers
      subject: 'CoviCare Account Confirmation ✔', // Subject line
      text: message, // plain text body
      // html: "<b>Hello world?</b>", // html body
    });

    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    return info;
  }
}

module.exports = Administrator;
