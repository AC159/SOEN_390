const express = require('express');
const router = express.Router();
const patientController = require('../controller/patientController')

const UserId = require('../domain/user').UserId
const Patient = require('../domain/patient');

router.get('', function (req, res) {
    res.send("Hello world");
});

router.get('/patient/:userId/profile', (req, res) => {
    try {
        const userId = new UserId(req.params.userId);
        const patient = new Patient(userId);
        patient.viewProfile();
        res.status(201).json();
    } catch (error) {
        res.status(400).json({error: error.message});
    }
})

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

router.get('/read', async (req, res) => {
    const mongodb = await req.app.locals.mongodb
    const response = await mongodb.db('test').collection('patients').findOne({name: "what"}, (error, patient) => {
        if (error)
            return console.log(error)
        if (!patient)
            res.send("Can't find patient")
        else res.send("Patient ID: " + patient._id)
    })
})

router.get('/addTest', async (req, res) => {
    const mongodb = await req.app.locals.mongodb
    const response = await mongodb.db('test').collection('patients').insertOne({
        name: "what",
        email: "who@gmail.com"
    }, (error, result) => {
        if (error)
            return console.log("Unable to add patient")
        res.send("Hello ID: " + result.insertedId)
        console.log("Added patient with ID: " + result.insertedId)
    })
})

router.post('/add', (req, res) => {
    console.log(req.body )
})

module.exports = router;
