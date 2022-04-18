const express = require('express');
const router = express.Router();
const {UserId} = require('../domain/user');
const {ImmigrationOfficial} = require('../domain/immigrationOfficial');
const ImmigrationOfficialRepository = require('../repository/ImmigrationOfficialRepository');

router.post('/:immigrationOfficialId/raise-flag', async (req, res) => {
  try {
    const patientId = req.body.patientId;
    const immigrationOfficialId = new UserId(req.params.immigrationOfficialId);
    const newFlagValue = req.body.flagValue;
    const immigrationOfficialRepository = new ImmigrationOfficialRepository(req.app.locals.mongodb);

    const immigrationOfficial = new ImmigrationOfficial(
      immigrationOfficialId,
      immigrationOfficialRepository,
    );
    const response = await immigrationOfficial.raiseFlag(patientId, newFlagValue);
    res.status(201).json({data: response});
  } catch (e) {
    res.status(400).json({error: e.message});
  }
});

router.get('/:immigrationOfficialId/user-covid-info', async (req, res) => {
  try {
    const userId = req.body.userId;
    const immigrationOfficialId = new UserId(req.params.immigrationOfficialId);
    const immigrationOfficialRepository = new ImmigrationOfficialRepository(req.body.mongo);

    const immigrationOfficial = new ImmigrationOfficial(
      immigrationOfficialId,
      immigrationOfficialRepository,
    );
    const profile = await immigrationOfficial.getUserCovidInfo(userId);
    res.status(200).json({profile});
  } catch (e) {
    res.status(400).json({error: e.message});
  }
});

router.get('/:immigrationOfficialId/traveler-info', async (req, res) => {
  try {
    const travelerId = req.body.travelerId;
    const immigrationOfficialId = new UserId(req.params.immigrationOfficialId);
    const immigrationOfficialRepository = new ImmigrationOfficialRepository(req.body.mongo);

    const immigrationOfficial = new ImmigrationOfficial(
      immigrationOfficialId,
      immigrationOfficialRepository,
    );
    const response = await immigrationOfficial.getTravelerInfo(travelerId);
    res.status(200).json({data: response});
  } catch (e) {
    res.status(400).json({error: e.message});
  }
});

router.get('/:immigrationOfficialId/patients', async (req, res) => {
  try {
    const immigrationOfficialId = new UserId(req.params.immigrationOfficialId);
    const immigrationOfficialRepository = new ImmigrationOfficialRepository(req.app.locals.mongodb);
    const immigrationOfficial = new ImmigrationOfficial(
      immigrationOfficialId,
      immigrationOfficialRepository,
    );
    const response = await immigrationOfficial.getAllPatients();
    res.status(200).json({data: response});
  } catch (error) {
    res.status(400).json({error: error.message});
    console.log(error.message);
  }
});

router.get('/get-travlers-form/:patientUid', async (req, res) => {
  try {
    const mongo = req.app.locals.mongodb;
    const userId = new UserId(req.params.patientUid);
    const immigrationOfficial = new ImmigrationOfficial(
      userId,
      new ImmigrationOfficialRepository(mongo),
    );
    const data = await immigrationOfficial.getTraveler();
    res.status(200).json(data);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({error: error.message});
  }
});

module.exports = router;
