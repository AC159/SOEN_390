const nodemailer = require("nodemailer");
const hbs = require('nodemailer-express-handlebars')
const path = require('path')
const nodemailer = require('nodemailer');


class User {
  constructor(userId, name, userRepository) {
    this.id = userId;
    this.name = name;
    this.userRepository = userRepository;
  }

  async viewProfile() {
    return await this.userRepository.fetch(this.id.getId());
  }

  async updateProfile(userProfile) {
    return await this.userRepository.update(this.id.getId(), userProfile);
  }

  async createProfile(userData) {
    await this.userRepository.add(userData);
    return await this.userRepository.fetch(userData.uid);
  }

  async getTypeAndStatus() {
    return await this.userRepository.fetchTypeAndStatus(this.id.getId());
  }

  async viewNotifications() {
    return await this.userRepository.fetchAllNotifications(this.id.getId());
  }

  async getChats(chatId) {
    return await this.userRepository.getUserChats(chatId);
  }

  async sendNonUserEmail(userEmail) {
    const subject = 'CoviCare CTR Alert';
    const inviteMessage = 'This email is to inform that you were reported in the contact tracing report of one of our patients at CoviCare. ' +
        'This means you were recently potentially in contact with someone COVID Positive. '+
        '\n We advise you to create an account at CoviCare by going to covicare-soen390.herokuapp.com to reduce the risk of spreading the illness. Thank you.';
    return await this.sendUserEmail(userEmail, subject, inviteMessage);
  }

  async sendNewNotificationEmail(userEmail) {
    const subject = 'CoviCare New Notification !';
    const message =
      'Hi. This email is to inform that you just received a new notification. Please log in as soon as possible to see the message.';
    return await this.sendUserEmail(userEmail, subject, message);
  }

  async sendUserEmail(userEmail, subject, message) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.COVICARE_EMAIL,
        pass: process.env.COVICARE_EMAIL_PASSWORD,
      },
    });

    const handlebarOptions = {
      viewEngine: {
          partialsDir: path.resolve('./views/'),
          defaultLayout: false,
      },
      viewPath: path.resolve('./views/'),
    };

    transporter.use('compile', hbs(handlebarOptions))

    var mailOptions = {
      from: process.env.COVICARE_EMAIL,
      to: userEmail, 
      subject: subject,
      template: 'email',
      context:{
          email: userEmail, 
          message: message,
      },
      attachments: [{
        filename: 'MainLogo.png',
        path: './frontend/src/assets/MainLogo.png',
        cid: 'logo'
      }]

    };


    const info = await transporter.sendMail(mailOptions, function(error, info){
      if(error){
          return console.log(error);
      }
      console.log('Message sent: ' + info.response);
  });

    //console.log('Message sent: ', info.messageId);
    return info;
  }
}

class UserId {
  constructor(id) {
    this.#setId(id);
  }

  #setId(id) {
    // Perform check
    this.id = id;
  }

  getId() {
    return this.id;
  }
}

class Name {
  constructor(firstName, lastName) {
    this.#setFirstName(firstName);
    this.#setLastname(lastName);
  }

  #setFirstName(firstName) {
    // Perform check
    this.firstName = firstName;
  }

  #setLastname(lastName) {
    // Perform check
    this.lastName = lastName;
  }

  getFirstName() {
    return this.firstName;
  }

  getlastName() {
    return this.lastName;
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

class Role {
  static Doctor = new Role(0);
  static Patient = new Role(1);
  static Administrator = new Role(2);
  static HealthOfficial = new Role(3);
  static ImmigrationOfficer = new Role(4);

  #isDoctor = false;
  #isPatient = false;
  #isAdministrator = false;
  #isHealthOfficial = false;
  #isImmigrationOfficer = false;
  #role;

  constructor(code) {
    switch (code) {
      case 0:
        this.#isDoctor = true;
        this.#role = 'doctor';
        break;
      case 1:
        this.#isPatient = true;
        this.#role = 'patient';
        break;
      case 2:
        this.#isAdministrator = true;
        this.#role = 'administrator';
        break;
      case 3:
        this.#isHealthOfficial = true;
        this.#role = 'health official';
        break;
      case 4:
        this.#isImmigrationOfficer = true;
        this.#role = 'immigration officer';
    }
  }

  getRole() {
    return this.#role;
  }

  isPatient() {
    return this.#isPatient;
  }

  isDoctor() {
    return this.#isDoctor;
  }

  isAdministrator() {
    return this.#isAdministrator;
  }

  isHealthOfficial() {
    return this.#isHealthOfficial;
  }

  isImmigrationOfficer() {
    return this.#isImmigrationOfficer;
  }
}

class UserState {
  static Pending = new UserState(0);
  static Approved = new UserState(1);

  #isPending = false;
  #isApproved = false;
  #state;

  constructor(code) {
    switch (code) {
      case 0:
        this.#isPending = true;
        this.#state = 'pending';
        break;
      case 1:
        this.#isApproved = true;
        this.#state = 'approved';
        break;
    }
  }

  getState() {
    return this.#state;
  }

  isPending() {
    return this.#isPending;
  }

  isApproved() {
    return this.#isApproved;
  }
}

module.exports.User = User;
module.exports.UserId = UserId;
module.exports.Name = Name;
module.exports.Role = Role;
module.exports.UserState = UserState;
