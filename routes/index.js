const express = require('express');
const router = express.Router();

const User = require('../domain/user');
const UserId = require('../domain/user').UserId;
const Role = require('../domain/user').Role;
const Patient = require('../domain/patient');
const Doctor = require('../domain/doctor')
const Administrator = require('../domain/administrator');
const {ObjectID} = require("mongodb");

router.get('', function (req, res) {
    res.send("Hello world");
});

router.get('/patient/:userId/profile', (req, res) => {
    try {
        const userId = new UserId(req.params.userId);
        const patient = new Patient(userId);
        patient.viewProfile();
        res.status(200).json();
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

router.post('/patient/:userId/profile', (req, res) => {
    try {
        const userId = new UserId(req.params.userId);
        const patient = new Patient(userId);  // TODO: add all information
        patient.updateProfile();
        res.status(201).send();
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

router.post('/updateUserInfo/:userId', async (req, res) => {
    try {
        const mongo = await req.app.locals.mongodb;
        const userId = new UserId(req.params.userId);
        const user = new User(userId);
        const response = await user.updateProfile(mongo, req.body.userAttributes);
        res.status(200).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/addNewUser', async (req, res) => {
    // No data conflict check at the moment
    const mongodb = await req.app.locals.mongodb
    const user = req.body
    const userId = new UserId(user.firebase)
    let newUser
    switch(req.body.user) {
        case "patient":
            newUser = new Patient(userId, user.firstName + " " + user.lastName)
            break
        case "doctor":
            newUser = new Doctor(userId)
            break
        case "healthOfficial":
            break
        case "immigrationOfficial":
            break
        case "administrator":
            newUser = new Administrator(userId)
            break
    }
    const response = await mongodb.db('test').collection(user.user).insertOne(newUser, (error, result) => {console.log(error)})
})

router.get('/admin/:adminId/users', async (req, res) => {
    try {
        const adminId = new UserId(req.params.adminId);
        const admin = new Administrator(adminId);
        const mongodb = await req.app.locals.mongodb
        const users = await admin.viewUsers(mongodb);
        res.status(200).json({
            users: users
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});

router.post('/admin/:adminId/user/:userId/role', async (req, res) => {
    try {
        let role;
        const adminId = new UserId(req.params.adminId);
        const userId = new UserId(req.params.userId);
        const admin = new Administrator(adminId);
        const mongodb = await req.app.locals.mongodb

        switch (req.body.role) {
            case 'doctor':
                role = Role.Doctor;
                break;
            case 'patient':
                role = Role.Patient;
                break;
            case 'administrator':
                role = Role.Administrator;
                break;
            case 'health official':
                role = Role.HealthOfficial;
                break;
            case 'immigration officer':
                role = Role.ImmigrationOfficer;
                break;
            default:
                throw new Error(`The provided role ${req.body.role} is not valid.`);
        }

        await admin.setUserRole(mongodb, new User(userId), role);
        res.status(201).send();
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});

module.exports = router;
