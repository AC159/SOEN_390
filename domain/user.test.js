const User = require('./user').User;
const UserId = require('./user').UserId;
const Name = require('./user').Name;

describe('test value object', () => {
  describe('test userId', () => {
    test('userId throws an error when id is not valid', () => {})

    test('userId returns valid id', () => {
      const id = "1234-12345";
      const userId = new UserId(id);

      expect(userId.getId()).toEqual(id);
    })
  })

  describe('test name', () => {
    test('firstName throws an error when not valid', () => {})
    test('lastName throws an error when not valid', () => {})

    test('Name returns valid firstName, lastName and name', () => {
      const firstName = "John";
      const lastName = "Doe";
      const userName = new Name(firstName, lastName);

      expect(userName.getFirstName()).toEqual("John");
      expect(userName.getlastName()).toEqual("Doe");
      expect(userName.getFullName()).toEqual("John Doe");
    })
  })
})

describe('test User object', () => {
  describe('user creation tests', () => {

  })

  describe('user method tests', () => {

  })
})