const {Notification} = require('./notification');
const {ObjectId} = require('mongodb');
const NotificationRepository = require('../repository/NotificationRepository');

jest.mock('../repository/NotificationRepository');

describe('test Notification object', () => {
  describe('test Notification constructor', () => {
    test('should return notification id', () => {
      const n_id = new ObjectId();
      const notification = new Notification(n_id, null);
      expect(notification.getNotificationId()).toEqual(n_id._id);
    });
  });

  describe('integration test - Notification creation, view and removal - connection to repository', () => {
    const notificationRepository = new NotificationRepository();
    const notification = new Notification(new ObjectId(), notificationRepository);

    test('GET /notification/12345/view', async () => {
      await notification.viewNotification();
      expect(notificationRepository.getNotification).toHaveBeenCalledTimes(1);
    });

    test('POST /notification/12345/delete', async () => {
      await notification.removeNotification();
      expect(notificationRepository.deleteNotification).toHaveBeenCalledTimes(1);
    });

    test('POST /notification/addNewNotification', async () => {
      await notification.createNotification();
      expect(notificationRepository.addNewNotification).toHaveBeenCalledTimes(1);
    });

    test('POST /notification/createManyNotifications', async () => {
      await notification.createManyNotifications();
      expect(notificationRepository.addManyNotifications).toHaveBeenCalledTimes(1);
    });
  });
});
