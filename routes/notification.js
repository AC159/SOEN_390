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
        res.status(201).json(notifications);
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
        res.status(201).json(response);
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
        const response = await notification.removeNotification();
        res.status(201).json(response);
    } catch (error) {
        res.status(500).json(error);
    }
})

router.post('/addNewNotification', async (req, res) => {
    // todo: agree on format for adding new notifications
})

module.exports = router;
