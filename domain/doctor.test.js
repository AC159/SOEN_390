describe('test value object', () => {
  describe('test license', () => {
    test('license throws an error when license id is not valid', () => {})

    test('license returns valid id', () => {
      id = "1234-12345";
      license = new License(id);

      expect(license.id).toEqual(id);
    })
  })
})

describe('test User object', () => {
  describe('user creation tests', () => {

  })

  describe('user method tests', () => {
    
  })
})