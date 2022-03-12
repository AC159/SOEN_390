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
    console.log('get-status-forms: ', data);
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

router.post('/submit-contact-tracing', async (req, res) => {
  try {
    const mongo = req.app.locals.mongodb;
    const userId = new UserId(req.body.patientUid);
    const patient = new Patient(userId, null, null, null, null, null, null, new PatientRepository(mongo));
    const data = await patient.postContactTracingReport(req.body);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
});

router.post('/update-contact-tracing/:userId', async (req, res) => {
  try {

    res.status(200).json();
  } catch (error) {
    res.status(400).json({error: error.message});
  }
})

router.get('/get-contact-tracing/:patientUid', async (req, res) => {
  try {
    const mongo = req.app.locals.mongodb;
    const userId = new UserId(req.body.patientUid);
    const patient = new Patient(userId, null, null, null, null, null, null, new PatientRepository(mongo));
    const data = await patient.getContactTracingReports();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
})

module.exports = router;
