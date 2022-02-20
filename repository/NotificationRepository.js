class NotificationRepository {
    constructor(mongo) {
        this.mongo = mongo;
    }

    async addNewNotification(notificationData) {
        try {
            return await this.mongo.db('test').collection('notification').insertOne(notificationData);
        } catch (e) {
            throw new Error('Can not add new notification');
        }
    }

    async getNotification(notificationId) {
        try {
            return await this.mongo.db('test').collection('notification').findOne({_id: notificationId});
        } catch (e) {
            throw new Error('Can not get notification');
        }
    }

    async deleteNotification(notificationId) {
        try {
            return await this.mongo.db('test').collection('notification').deleteOne({_id: notificationId});
        } catch (e) {
            throw new Error('Can not delete notification');
        }
    }
}

module.exports = NotificationRepository;