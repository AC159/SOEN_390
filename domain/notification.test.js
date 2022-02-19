const Notification = require('./notification.js');

describe('test Notification object', () => {
    describe('test Notification constructor', () => {
        test('should return notification id', () => {
            const notification = new Notification('a1b2c3d4e5', null);
            expect(notification.getNotificationId()).toEqual('a1b2c3d4e5');
        })

    })
})