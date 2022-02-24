const express = require('express');
const {UserId} = require("../domain/user");
const Doctor = require("../domain/doctor");
const DoctorRepository = require("../repository/DoctorRepository");
const router = express.Router();

router.get('/:doctorId/patientArray',async function(req,res){
    const doctorId = new UserId(req.params.doctorId);
    const mongo =req.app.locals.mongodb;
    const doctorRepository = new DoctorRepository(mongo);
    const doctor = new Doctor(doctorId, doctorRepository);
    const response = await doctor.getPatients();
    res.status(200).json({data:response});
});
    

module.exports = router;