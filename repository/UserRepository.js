const nodemailer = require("nodemailer");

class UserRepository {
  constructor(mongo) {
    this.mongo = mongo;
  }

  add(user) {
    return this.mongo.db('test').collection('user').insertOne(user);
  }

  fetch(userId) {
    return this.mongo.db('test').collection('user').findOne(
      {$or: [{uid: userId}, {email: userId}]},
      {_id: 0, uid: 1, email: 1, userType: 1});
  }

  update(userId, values) {
    return this.mongo.db('test').collection('user').updateOne({uid: userId}, {$set: values});
  }

  fetchAll() {
    return this.mongo.db('test').collection('user').find({});
  }

  delete(userId) {
    return this.mongo.db('test').collection('user').deleteOne({uid: userId});
  }

  fetchAllNotifications(userId) {
    return this.mongo.db('test')
        .collection('notification')
        .find({userId: userId}, {_id: 1}).toArray();
  }

  fetchTypeAndStatus(userId) {
    return this.mongo.db('test').collection('user').findOne({uid: userId},
      {userStatus: 1, userType: 1, uid: 0});
  };
}

module.exports = UserRepository;
