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
    const response = await doctor.createAppointment(patientId, rest);
  } catch (e) {

  }
});


module.exports = router;
