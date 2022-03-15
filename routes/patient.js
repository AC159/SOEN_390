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

router.get('/get-status-forms/:userId', async (req, res) => {
  try {
    const mongo = req.app.locals.mongodb;
    const userId = new UserId(req.params.userId);
    const patient = new Patient(userId, null, null, null, null, null, null, new PatientRepository(mongo));
    const data = await patient.getPatientStatusForms();
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
    const response = await patient.raiseFlag(req.body.flagType, req.body.flagValue, req.body.flaggingUser);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
});

router.get('/get-patients-covid-info/:officialId', async (req, res) => {
  try {
    // officialId is the uid of either the immigration official or the health official
    const mongo = req.app.locals.mongodb;
    const patient = new Patient(null, null, null, null, null, null, null, new PatientRepository(mongo));
    const data = await patient.getPatientsCovidInfo(req.params.officialId);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});


router.post('/:userID/requestDoctor', async (req, res)=> {
  try {
    const mongo = req.app.locals.mongodb;
    const userId = new UserId(req.params.userID);
    const requestValue = req.body.requestSent;
    const patient = new Patient(userId, null, null, null, null, null, null, new PatientRepository(mongo));
    const data = await patient.requestDoctor(requestValue);
    res.status(200).json(data);
    } catch (error) {
    res.status(400).json({error: error.message});
  }
});

router.post('/submit-contact-tracing', async (req, res) => {
  try {
    const mongo = req.app.locals.mongodb;
    const userId = new UserId(req.body.patientUid);
    const patient = new Patient(userId, null, null, null, null, null, null, new PatientRepository(mongo));
    const contactTracingReport = {
      timeStamp: Date.now(),
      patientUid: userId.getId(),
      emailList: req.body.emailList,
      date: req.body.date,
      locationDescription: req.body.locationDescription
    }
    const response = await patient.postContactTracingReport(contactTracingReport);
    res.status(200).json(response);

  } catch (error) {
    res.status(400).json({error: error.message});
  }
});

router.post('/update-contact-tracing/:userId&timeStamp=:timeStamp', async (req, res) => {
  try {
    const mongo = req.app.locals.mongodb;
    const userId = new UserId(req.params.userId);
    const timeStamp = parseFloat(req.params.timeStamp);
    const updatedValues = req.body.updatedValues;

    const patient = new Patient(userId, null, null, null, null, null, null, new PatientRepository(mongo));
    const response = await patient.updateContactTracingReport(timeStamp, updatedValues);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
});

router.get('/get-contact-tracing/:patientUid', async (req, res) => {
  try {
    const mongo = req.app.locals.mongodb;
    const userId = new UserId(req.params.patientUid);
    const patient = new Patient(userId, null, null, null, null, null, null, new PatientRepository(mongo));
    const data = await patient.getContactTracingReports();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({error: error.message});
    console.log(error.message);
  }
});


module.exports = router;
