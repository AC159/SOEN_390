const express = require('express');
const router = express.Router();

const UserId = require('../domain/user').UserId
const Patient = require('../domain/patient');

router.get('', function (req, res) {
   res.send("Hello world");
});

router.get('/patient/:userId/profile', (req, res) => {
   try {
      const userId = new UserId(req.params.userId);
      const patient = new Patient(userId);
      patient.viewProfile();
      res.status(201).json();
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

module.exports = router;
