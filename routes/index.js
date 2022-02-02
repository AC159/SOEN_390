const express = require('express');
const router = express.Router();

const UserId = require('../domain/user').UserId;
const Role = require('../domain/user').Role;
const Patient = require('../domain/patient');
const Administrator = require('../domain/administrator');

router.use(express.json());
router.user(express.urlencoded({ extended: true }));

router.get('', function (req, res) {
   res.send("Hello world");
});

router.get('/patient/:userId/profile', (req, res) => {
   try {
      const userId = new UserId(req.params.userId);
      const patient = new Patient(userId);
      patient.viewProfile();
      res.status(200).json();
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
})

router.post('/patient/:userId/profile', (req, res) => {
   try {
      const userId = new UserId(req.params.userId);
      const patient = new Patient(userId);  // TODO: add all information
      patient.updateProfile();
      res.status(201).send();
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
});

router.get('/admin/:adminId/users', (req, res) => {
   try {
      const adminId = new UserId(req.params.adminId);
      const admin = new Administrator(adminId);
      const users = admin.viewUsers();
      res.status(200).json({
         users: users
      });
   } catch (Error) {

   }
});

router.post('/admin/:adminId/user/:userId/role', (req, res) => {
   try {
      let role;
      const adminId = new UserId(req.params.adminId);
      const userId = new UserId(req.params.userId);
      const admin = new Administrator(adminId);

      switch (req.body.role) {
         case 'doctor':
            role = Role.Doctor;
            break;
         case 'patient':
            role = Role.Patient;
            break;
         case 'administrator':
            role = Role.Administrator;
            break;
         case 'health official':
            role = Role.HealthOfficial;
            break;
         case 'immigration officer':
            role = Role.ImmigrationOfficer;
            break;
         default:
            throw new Error(`The provided role ${req.body.role} is not valid.`);
      }

      admin.setUserRole(new User(userId), role);
      res.status(201).send();
   } catch (Error) {

   }
});

module.exports = router;
