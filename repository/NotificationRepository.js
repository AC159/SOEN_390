class NotificationRepository {
    constructor(mongo) {
        this.mongo = mongo;
    }

    async getNotification(notificationId) {
        try {
            return await this.mongo.db('test').collection('notification').findOne({}, {_id: 1});
        } catch (e) {
            throw new Error('Can not get notification');
        }
    }

    async addNewNotification(notificationData) {
        try {
            return await this.mongo.db('test').collection('notification').insertOne(notificationData);
        } catch (e) {
            throw new Error('Can not add new notification');
        }
    }

    async deleteNotification(notificationId) {
        try {
            return await this.mongo.db('test').collection('notification').findOneAndDelete({notificationId: notificationId});
        } catch (e) {
            throw new Error('Can not delete notification');
        }
    }
}

module.exports = NotificationRepository;