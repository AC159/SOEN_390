class NotificationRepository {
    constructor(mongo) {
        this.mongo = mongo;
    }

    addNewNotification(notificationData) {
        return this.mongo.db('test').collection('notification').insertOne(notificationData);
    }

    getNotification(notificationId) {
        return this.mongo.db('test').collection('notification').findOne({_id: notificationId});
    }

    deleteNotification(notificationId) {
        return this.mongo.db('test').collection('notification').deleteOne({_id: notificationId});
    }
}

module.exports = NotificationRepository;