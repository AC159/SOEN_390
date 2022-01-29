describe('test value object', () => {
  describe('test userId', () => {
    test('userId throws an error when id is not valid', () => {})

    test('userId returns valid id', () => {
      id = "1234-12345";
      userId = new UserId(id);

      expect(userId.id).toEqual(id);
    })
  })

  describe('test name', () => {
    test('firstName throws an error when not valid', () => {})
    test('lastName throws an error when not valid', () => {})

    test('Name returns valid firstName, lastName and name', () => {
      firstName = "John";
      lastName = "Doe";
      userName = new Name(firstName, lastName);

      expect(userName.firstName).toEqual("John");
      expect(userName.lastName).toEqual("Doe");
      expect(userName.name).toEqual("John Doe");
    })
  })
})

describe('test User object', () => {
  describe('user creation tests', () => {

  })

  describe('user method tests', () => {
    
  })
})