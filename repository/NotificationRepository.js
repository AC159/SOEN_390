class NotificationRepository {
  constructor(mongo) {
    this.mongo = mongo;
  }

  addNewNotification(notificationData) {
    return this.mongo.db('test').collection('notification').insertOne(notificationData);
  }

  addManyNotifications(notificationData) {
    return this.mongo.db('test').collection('notification').insertMany(notificationData);
  }

  getNotification(notificationId) {
    return this.mongo.db('test').collection('notification').findOne({_id: notificationId});
  }

  deleteNotification(notificationId) {
    return this.mongo.db('test').collection('notification').deleteOne({_id: notificationId});
  }
}

module.exports = NotificationRepository;
