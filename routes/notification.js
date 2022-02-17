const express = require('express');
const router = express.Router();

const {UserId, User} = require("../domain/user");
const UserRepository = require("../repository/UserRepository");


router.get('/:userId/all-notifications-id', async (req, res) => {
    try {
        const userId = new UserId(req.params.userId);
        const mongo = await req.app.locals.mongodb;
        const user = new User(userId, new UserRepository(mongo));
        const notifications = await user.viewNotifications();
        console.log(notifications);
        res.status(201).json(notifications);
    } catch (error) {
        res.status(500).json(error);
    }
})

router.get('/:notificationId/content', async (req, res) => {
    try {
        const notificationId = req.params.notificationId;
        const mongo = await req.app.locals.mongodb;
        const notification = new Notification(notificationId, new NotificationRepository(mongo));
        const response = await notification.viewNotification();
        res.status(201).json(response);
    } catch (error) {
        res.status(500).json(error);
    }
})

router.post('/:notificationId/delete', async (req, res) => {
    try {
        const notificationId = req.params.notificationId;
        const mongo = await req.app.locals.mongodb;
        const notification = new Notification(notificationId, new NotificationRepository(mongo));
        const response = await notification.removeNotification();
        res.status(201).json(response);
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router;
