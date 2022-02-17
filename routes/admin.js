const express = require('express');
const {UserId} = require('../domain/user');
const Administrator = require('../domain/administrator');
const AdminRepository = require('../repository/AdminRepository');
const router = express.Router();

router.get('/:adminId/pending-patients', async (req, res) => {
  try {
    const adminId = new UserId(req.params.adminId);
    const adminRepository = new AdminRepository(req.app.locals.mongodb);

    const admin = new Administrator(adminId, adminRepository);
    const users = await admin.viewPatients();

    res.status(200).json({users});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
});

router.post('/:adminId/approve-patient', async (req, res) => {
  try {
    const patientUid = req.body.userId;
    const adminId = new UserId(req.params.adminId);
    const adminRepository = new AdminRepository(req.app.locals.mongodb);

    const admin = new Administrator(adminId, adminRepository);
    const response = await admin.approvePatient(patientUid);

    res.status(200).json({data: response});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
});

router.get('/:adminId/pending-doctors', async (req, res) => {
  try {
    const adminId = new UserId(req.params.adminId);
    const adminRepository = new AdminRepository(req.app.locals.mongodb);

    const admin = new Administrator(adminId, adminRepository);
    const doctors = await admin.viewDoctors();

    res.status(200).json({doctors});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
});

router.post('/:adminId/approve-doctor', async (req, res) => {
  try {
    const doctorUid = req.body.userId;
    const adminId = new UserId(req.params.adminId);
    const adminRepository = new AdminRepository(req.app.locals.mongodb);

    const admin = new Administrator(adminId, adminRepository);
    const response = await admin.approveDoctor(doctorUid);

    res.status(200).json({data: response});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
});

module.exports = router;
