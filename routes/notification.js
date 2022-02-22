const express = require('express');
const router = express.Router();

const {UserId, User} = require("../domain/user");
const {Notification} = require("../domain/notification");
const UserRepository = require("../repository/UserRepository");
const NotificationRepository = require("../repository/NotificationRepository");
const {ObjectId} = require("mongodb");


router.get('/:userId/notifications', async (req, res) => {
    try {
        const userId = new UserId(req.params.userId);
        const mongo = await req.app.locals.mongodb;
        const user = new User(userId, null, new UserRepository(mongo));
        const notifications = await user.viewNotifications();
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json(error);
    }
})

router.get('/:notificationId/view', async (req, res) => {
    try {
        const notificationId = ObjectId(req.params.notificationId);
        const mongo = await req.app.locals.mongodb;
        const notification = new Notification(notificationId, new NotificationRepository(mongo));
        const response = await notification.viewNotification();
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
})

router.post('/:notificationId/delete', async (req, res) => {
    try {
        const notificationId = ObjectId(req.params.notificationId);
        const mongo = await req.app.locals.mongodb;
        const notification = new Notification(notificationId, new NotificationRepository(mongo));
        const deletedNotification = await notification.removeNotification();
        res.status(201).json(deletedNotification);
    } catch (error) {
        res.status(500).json(error);
    }
})

router.post('/addNewNotification', async (req, res) => {
    // todo: agree on format for adding new notifications
})

router.post('/:userId/createTestNotifications', async (req, res) => {
    try {
        const userId = req.params.userId;
        const mongo = await req.app.locals.mongodb;
        const notification = new Notification(null, new NotificationRepository(mongo));
        const firstNotification = await notification.createNotification({
            type: "warning",
            heading: "Test Warning!",
            mainText: "You have been flagged as F1!",
            subText: "Not really, it's just the template",
            timeStamp: Date.now(),
            userId: userId
        });
        const secondNotification = await notification.createNotification({
            type: "primary",
            heading: "Welcome to CoviCare!",
            mainText: "Let's get you going...",
            subText: "First, update your profile information by clicking in your profile picture.",
            timeStamp: Date.now(),
            userId: userId
        });
        res.status(201).json([firstNotification, secondNotification]);
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router;
