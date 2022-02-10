const express = require('express');
const router = express.Router();
const { User, UserId, Name } = require('../domain/user');
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
    // No data conflict check at the moment
    const mongodb = await req.app.locals.mongodb;
    const user = req.body;
    console.log(user);
    const userId = new UserId(user.userId);
    const userName = new Name(user.firstName, user.lastName);
    const newUser = new User(userId, userName);
    const data = {
        uid: newUser.id.getId(),
        name: newUser.name.getFullName(),
        userStatus: user.userStatus,
        isFlagged: false,
        phoneNumber: user.phoneNumber,
        dob: user.dob,
        address: user.address,
        userType: user.userType,
        verification: user.verification,
        email: user.email
    };
    try {
        const insertedData = await newUser.createProfile(mongodb, data);
        res.status(201).json(insertedData);
    } catch (error) {
        res.status(500).json(error);
    }
});


router.post('/update-profile/:userId', async (req, res) => {
    console.log(req.body)
    try {
        const mongo = req.app.locals.mongodb;
        const userId = new UserId(req.params.userId);
        const user = new User(userId, null, new UserRepository(mongo));
        const data = await user.updateProfile(req.body.userAttributes);
        res.status(201).json(data);
    } catch(error) {
        res.status(500).json(error);
    }
});

module.exports = router;
