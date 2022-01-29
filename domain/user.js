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

  get id() {
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

  get firstName() {
    return this.firstName;
  }

  get lastName() {
    return this.lastName;
  }

  get name() {
    return `${this.firstName} ${this.lastName}`;
  }
}