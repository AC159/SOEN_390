const express = require('express');
const {UserId} = require('../domain/user');
const Patient = require('../domain/patient');
const PatientRepository = require('../repository/PatientRepository');
const router = express.Router();


router.post('/submit-status-form', async (req, res) => {
  try {
    const mongo = req.app.locals.mongodb;
    const userId = new UserId(req.body.patientUid);
    const patient = new Patient(userId, null, null, null, null, null, null, new PatientRepository(mongo));
    const data = await patient.postStatusForm(req.body);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
});

router.post('/update-status-form/:userId', async (req, res) => {
  try {
    const mongo = req.app.locals.mongodb;
    const userId = new UserId(req.params.userId);
    const patient = new Patient(userId, null, null, null, null, null, null, new PatientRepository(mongo));
    const data = await patient.updateStatusForm(req.body);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
});

router.get('/get-status-form/:userId', async (req, res) => {
  try {
    const mongo = req.app.locals.mongodb;
    const userId = new UserId(req.params.userId);
    const patient = new Patient(userId, null, null, null, null, null, null, new PatientRepository(mongo));
    const data = await patient.getPatientStatusForm();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
});

router.post('/raise-flag/:userId', async (req, res) => {
  try {
    const mongo = req.app.locals.mongodb;
    const userId = new UserId(req.params.userId);
    const patient = new Patient(userId, null, null, null, null, null, null, new PatientRepository(mongo));
    // flagType can be either doctorFlag, immigrationOfficerFlag or healthOfficerFlag and flagValue can be either true or false
    const response = await patient.raiseFlag(req.body.flagType, req.body.flagValue);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
});

module.exports = router;
