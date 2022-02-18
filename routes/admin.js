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

router.get('/:adminId/pending-health-officer', async (req, res) => {
  try {
    const adminId = new UserId(req.params.adminId);
    const adminRepository = new AdminRepository(req.app.locals.mongodb);

    const admin = new Administrator(adminId, adminRepository);
    const response = await admin.viewHealthOfficers();

    res.status(200).json({data: response});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
});

router.get('/:adminId/pending-immigration-officer', async (req, res) => {
  try {
    const adminId = new UserId(req.params.adminId);
    const adminRepository = new AdminRepository(req.app.locals.mongodb);

    const admin = new Administrator(adminId, adminRepository);
    const response = await admin.viewImmigrationOfficers();

    res.status(200).json({data: response});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
});

router.post('/:adminId/approve-user', async (req, res) => {
  try {
    const userId = req.body.userId;
    const adminId = new UserId(req.params.adminId);
    const adminRepository = new AdminRepository(req.app.locals.mongodb);

    const admin = new Administrator(adminId, adminRepository);
    const response = await admin.approvePendingUser(userId);

    res.status(200).json({data: response});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
});

router.post('/:adminId/reject-user', async (req, res) => {
  try {
    const userId = req.body.userId;
    const adminId = new UserId(req.params.adminId);
    const adminRepository = new AdminRepository(req.app.locals.mongodb);

    const admin = new Administrator(adminId, adminRepository);
    const response = await admin.rejectPendingUser(userId);

    res.status(200).json({data: response});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
});

router.get('/:adminId/patients', async (req, res) => {
  try {
    const adminId = new UserId(req.params.adminId);
    const adminRepository = new AdminRepository(req.app.locals.mongodb);

    const admin = new Administrator(adminId, adminRepository);
    const response = await admin.viewUnassignedPatient();

    res.status(200).json({data: response});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
});

router.post('/:adminId/patient', async (req, res) => {
  try {
    const adminId = req.params.adminId;
    const patientId = req.body.patient;
    const doctorId = req.body.doctor;

    const adminRepository = new AdminRepository(req.app.locals.mongodb);
    const admin = new Administrator(adminId, adminRepository);
    admin.assignPatient(patientId, doctorId);

    res.status(200).json({message: 'success'});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
});

router.get('/:adminId/doctors', async (req, res) => {
  try {
    const adminId = new UserId(req.params.adminId);
    const adminRepository = new AdminRepository(req.app.locals.mongodb);

    const admin = new Administrator(adminId, adminRepository);
    const response = await admin.fetchDoctorProfiles();

    res.status(200).json({data: response});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
});

module.exports = router;
