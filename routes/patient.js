const express = require('express');
const {UserId} = require("../domain/user");
const Patient = require("../domain/patient");
const router = express.Router();

router.get('/:userId/profile', async (req, res) => {
    try {
        const userId = new UserId(req.params.userId);
        const patient = new Patient(userId);
        const response = await patient.viewProfile();
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

router.post('/:userId/profile', (req, res) => {
    try {
        const userId = new UserId(req.params.userId);
        const patient = new Patient(userId);  // TODO: add all information
        patient.updateProfile();
        res.status(201).send();
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

module.exports = router;
