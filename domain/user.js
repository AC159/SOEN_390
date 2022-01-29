class User {
  constructor(userId, name) {
    this.id = userId;
    this.name = name;
  }

  viewProfile() {
    throw new Error(`${this.viewProfile.name} is not implemented.`);
  }

  updateProfile() {
    throw new Error(`${this.updateProfile.name} is not implemented.`);
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

module.exports = User;
module.exports.UserId = UserId;
module.exports.Name = Name;
module.exports.Role = Role;
