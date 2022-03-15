const express = require('express');
const router = express.Router();
const {User, UserId, Name} = require('../domain/user');
const UserRepository = require('../repository/UserRepository');

router.get('/:userId/profile', async (req, res) => {
  try {
    const userId = new UserId(req.params.userId);
    const mongo = await req.app.locals.mongodb;
    const user = new User(userId, null, new UserRepository(mongo));
    const response = await user.viewProfile();
    console.log('Get user profile DB response: ', response);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
});

router.post('/addNewUser', async (req, res) => {
  const mongodb = await req.app.locals.mongodb;
  const request = req.body;

  const repository = new UserRepository(mongodb);
  const userId = new UserId(request.userId);
  const userName = new Name(request.firstName, request.lastName);
  const newUser = new User(userId, userName, repository);

  const data = {
    uid: newUser.id.getId(),
    name: newUser.name.getFullName(),
    userStatus: request.userStatus,
    isFlagged: false,
    phoneNumber: request.phoneNumber,
    dob: request.dateOfBirth,
    address: request.address,
    userType: request.userType,
    verification: request.verification,
    email: request.email,
    covidStatus: false,
  };
  try {
    const insertedData = await newUser.createProfile(data);
    res.status(201).json(insertedData);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/update-profile/:userId', async (req, res) => {
  console.log(req.body);
  try {
    const mongo = req.app.locals.mongodb;
    const userId = new UserId(req.params.userId);
    const user = new User(userId, null, new UserRepository(mongo));
    const data = await user.updateProfile(req.body.userAttributes);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get('/:userId/getTypeAndStatus', async (req, res) => {
  try {
    const mongo = req.app.locals.mongodb;
    const userId = new UserId(req.params.userId);
    const user = new User(userId, null, new UserRepository(mongo));
    const data = await user.getTypeAndStatus();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/sendInviteEmail', async (req, res) => {
  try {
    const mongo = req.app.locals.mongodb;
    const user = new User(null, null, new UserRepository(mongo));
    const userEmail = req.body.userEmail;
    console.log(userEmail);
    const inviteMessage = req.body.inviteMessage;
    console.log(inviteMessage);
    const response = await user.sendNonUserEmail(userEmail, inviteMessage);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
    console.log(error.message);
  }
})

module.exports = router;
