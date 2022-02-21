const request = require('supertest');
const MongoClient = require('mongodb').MongoClient;
const {Notification} = require('../domain/notification');
const app = require('../app');
const server = require('../app').server;

jest.mock('../domain/notification');
jest.mock('mongodb');

describe('integration test notificationRoutes - connection to notification domain', () => {

    describe('test view notification', () => {

        jest.spyOn(Notification.prototype, 'viewNotification').mockImplementation(() => {
            return {
                type: 'warning',
                heading: 'Test'
            };
        });
        jest.spyOn(MongoClient.prototype, 'connect').mockImplementation(() => {});

        it('should be able to view notification', async () => {
            const res = await request(app).get('/notification/11244/view');
            expect(res.status).toEqual(200);
        });

    })

})