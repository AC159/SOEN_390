const request = require('supertest');
const MongoClient = require('mongodb').MongoClient;
const {Notification} = require('../domain/notification');
const app = require('../app');

jest.mock('../domain/notification');
jest.mock('mongodb');

describe('integration test notificationRoutes - connection to notification domain', () => {
  describe('test GET /notification/:notificationId/view', () => {
    jest.spyOn(Notification.prototype, 'viewNotification').mockImplementation(() => {});
    jest.spyOn(MongoClient.prototype, 'connect').mockImplementation(() => {});

    it('should be able to view notification', async () => {
      const res = await request(app).get('/notification/11244/view');
      expect(res.status).toEqual(200);
    });
  });

  describe('test POST /notification/:notificationId/delete', () => {
    jest.spyOn(Notification.prototype, 'removeNotification').mockImplementation(() => {});
    jest.spyOn(MongoClient.prototype, 'connect').mockImplementation(() => {});

    it('should be able to delete notification', async () => {
      const res = await request(app).post('/notification/11244/delete');
      expect(res.status).toEqual(201);
    });
  });

  describe('test POST /notification/:notificationId/createTestNotifications', () => {
    jest.spyOn(Notification.prototype, 'createManyNotifications').mockImplementation(() => {});
    jest.spyOn(MongoClient.prototype, 'connect').mockImplementation(() => {});

    it('should be able to add 2 new template notifications', async () => {
      const res = await request(app).post('/notification/12345/createTestNotifications');
      expect(res.status).toEqual(201);
    });
  });
});
