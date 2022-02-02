const express = require('express');
const router = express.Router();

const UserId = require('../domain/user').UserId
const Patient = require('../domain/patient');

router.get('/patient/:userId/profile', async (req, res) => {
   try {

      const mongodb = await req.app.locals.mongodb;
      const response = await mongodb.db('test').collection('users').findOne({ uid: req.params.userId });

      const userId = new UserId(req.params.userId);
      const patient = new Patient(userId);
      patient.viewProfile();

      res.status(200).send(response);
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
})

router.post('/patient/:userId/profile', async function (req, res) {

   // temporary code that will need to be replaced with the correct info from sign up form

   try {
      const userObj = {
         email: req.body.email,
         firstName: req.body.firstName,
         lastName: req.body.lastName,
         uid: req.params.userId,
         userType: req.body.userType,
         healthInsuranceNumber: req.body.healthInsuranceNumber
      };

      const mongodb = await req.app.locals.mongodb;
      const response = await mongodb.db('test').collection('users').insertOne(userObj);

      // const userId = new UserId(req.params.userId);
      // const patient = new Patient(req.body.uid, req.body.firstName, req.body.lastName, req.body.userType, req.body.phoneNumber);
      // patient.updateProfile();
      res.status(201).send(response);
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
});

module.exports = router;
