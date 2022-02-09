class UserRepository {
  constructor(mongo) {
    this.mongo = mongo;
  }

  add(user) {
    return this.mongo.db('test')
      .collection('users')
      .insertOne(user);
  }

  // TODO: SPECIFY DEFAULT VALUE CORRECTLY
  fetch(userId, parameters = {}) {
    return this.mongo.db('test')
      .collection('users')
      .findOne({
        uid: userId
      })
      .project(parameters);
  }

  fetchAll() {
    return this.mongo.db('test')
      .collection('users')
      .find({});
  }

  delete(userId) {
    return this.mongo.db('test')
      .collection('users')
      .deleteOne({
        uid: userId
      })
  }

  getProfile = async (userId) => {
    try {
      const profile = await this.mongo.db('test')
        .collection('patient')
        .findOne({
          uid: userId
        });

      return {
        uid: profile.uid,
        name: profile.name,
        phoneNumber: profile.phoneNumber,
        dob: profile.dob,
        address: profile.address
      }
    } catch (e) {
      console.log(e)
      throw new Error("Could not fetch user profile");
    }
  }
}

module.exports = UserRepository;