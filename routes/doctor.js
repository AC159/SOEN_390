const express = require('express');
const {UserId} = require('../domain/user');
const Doctor = require('../domain/doctor');
const DoctorRepository = require('../repository/DoctorRepository');
const router = express.Router();

router.get('/:doctorId/patientArray', async function(req, res) {
  try {
    const doctorId = new UserId(req.params.doctorId);
    const mongo = req.app.locals.mongodb;
    const doctorRepository = new DoctorRepository(mongo);
    const doctor = new Doctor(doctorId, doctorRepository);
    const response = await doctor.getPatients();
    console.log('Patients: ', response);
    res.status(200).json({data: response});
  } catch (e) {
    res.status(400).json({error: e.message});
  }
});

router.post('/:doctorId/appointment', async (req, res) => {
  try {
    const doctorId = new UserId(req.params.doctorId);
    const {patientId, ...rest} = req.body;
    const doctorRepository = new DoctorRepository(req.app.locals.mongodb);
    const doctor = new Doctor(doctorId, doctorRepository);
    await doctor.createAppointment(patientId, rest);

    res.status(200).json({message: 'success'});
  } catch (e) {
    res.status(400).json({error: e.message});
  }
});

router.get('/:doctorId/appointments', async (req, res) => {
  try {
    const doctorId = new UserId(req.params.doctorId);
    const doctor = new Doctor(doctorId, new DoctorRepository(req.app.locals.mongodb));
    const response = await doctor.getAppointments();

    res.status(200).json({data: response});
  } catch (e) {
    res.status(400).json({error: e.message});
  }
});

router.post('/:doctorId/raise-flag', async (req, res) => {
  try {
    const userId = req.body.patientId;
    const doctorId = new UserId(req.params.doctorId);
    const newFlagValue = req.body.flagValue;
    const doctorRepository = new DoctorRepository(req.app.locals.mongodb);
    const doctor = new Doctor(doctorId, doctorRepository);
    const response = await doctor.raiseFlag(userId, newFlagValue);
    res.status(201).json({data: response});
  } catch (e) {
    res.status(400).json({error: e.message});
    console.log(e.message);
  }
});

router.post('/question-answer', async (req, res) => {
  try {
    const doctorId = new UserId(req.body.doctorUid);
    const doctorRepository = new DoctorRepository(req.app.locals.mongodb);
    const doctor = new Doctor(doctorId, doctorRepository);
    const response = await doctor.postQuestions(req.body);
    res.status(201).json({data: response});
  } catch (error) {
    res.status(400).json({error: error.message});
    console.log(error.message);
  }
});

module.exports = router;
