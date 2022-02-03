class User {
  constructor(userId, name) {
    this.id = userId;
    this.name = name;
  }

  async viewProfile(mongo) {
    console.log(this.id.getId());
    return await mongo.db('test').collection('patient').findOne({uid: this.id.getId()});
  }

  async updateProfile(mongo, userProfile) {
    return await mongo.db('test').collection('patient').updateOne({userId: this.id.getId()}, { $set: userProfile });
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
    return this.firstName
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
    switch(code) {
      case 0:
        this.#isDoctor = true;
        this.#role = "doctor";
        break;
      case 1:
        this.#isPatient = true;
        this.#role = "patient";
        break;
      case 2:
        this.#isAdministrator = true;
        this.#role = "administrator";
        break;
      case 3:
        this.#isHealthOfficial = true;
        this.#role = "health official";
        break;
      case 4:
        this.#isImmigrationOfficer = true;
        this.#role = "immigration officer";
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
    switch(code) {
      case 0:
        this.#isPending = true;
        this.#state = "pending";
        break;
      case 1:
        this.#isApproved = true;
        this.#state = "approved";
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

module.exports = User;
module.exports.UserId = UserId;
module.exports.Name = Name;
module.exports.Role = Role;
module.exports.UserState = UserState;
