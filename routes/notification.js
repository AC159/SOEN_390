const express = require('express');
const router = express.Router();

const {UserId, User} = require('../domain/user');
const {Notification} = require('../domain/notification');
const UserRepository = require('../repository/UserRepository');
const NotificationRepository = require('../repository/NotificationRepository');
const {ObjectId} = require('mongodb');


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
});

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
});

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
});

router.post('/addNewNotification', async (req, res) => {
  try {
    const userEmail = req.body.patientEmail;
    const mongo = await req.app.locals.mongodb;
    const notification = new Notification(null, new NotificationRepository(mongo));
    const notificationData = {
      type: req.body.type,
      heading: req.body.heading,
      mainText: req.body.mainText,
      subText: req.body.subText,
      timeStamp: Date.now(),
      userId: req.body.patientUid
    };
    const response = await notification.createNotification(notificationData);
    const emailResponse = await notification.sendNewNotificationEmail(userEmail);

    res.status(201).json({response, emailResponse});
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post('/:userId/createTestNotifications', async (req, res) => {
  try {
    const userId = req.params.userId;
    const mongo = await req.app.locals.mongodb;
    const notification = new Notification(null, new NotificationRepository(mongo));
    const firstNotification = {
      type: 'warning',
      heading: 'Test Warning!',
      mainText: 'You have been flagged as F1!',
      subText: 'Not really, it\'s just the template',
      timeStamp: Date.now(),
      userId: userId,
    };
    const secondNotification = {
      type: 'primary',
      heading: 'Welcome to CoviCare!',
      mainText: 'Let\'s get you going...',
      subText: 'First, update your profile information by clicking in your profile picture.',
      timeStamp: Date.now(),
      userId: userId,
    };
    const response = await notification.createManyNotifications([firstNotification, secondNotification]);
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
