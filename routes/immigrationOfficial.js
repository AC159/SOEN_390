const express = require('express');
const router = express.Router();
const {UserId} = require('../domain/user');
const ImmigrationOfficial = require('../domain/immigrationOfficial');
const ImmigrationOfficialRepository = require('../repository/ImmigrationOfficialRepository');
const HealthOfficialRepository = require("../repository/HealthOfficialRepository");
const HealthOfficial = require("../domain/healthOfficial");

router.post('/:immigrationOfficialId/raise-flag', async (req, res) => {
  try {
    const userId = req.body.userId;
    const immigrationOfficialId = new UserId(req.params.immigrationOfficialId);
    const immigrationOfficialRepository = new ImmigrationOfficialRepository(
        req.body.mongo,
    );

    const immigrationOfficial = new ImmigrationOfficial(immigrationOfficialId, immigrationOfficialRepository);
    const response = await immigrationOfficial.raiseFlag(userId);
    res.status(201).json({data: response});
  } catch (e) {
    res.status(400).json({error: e.message});
  }
});

router.get('/:immigrationOfficialId/user-covid-info', async (req, res) => {
  try {
    const userId = req.body.userId;
    const immigrationOfficialId = new UserId(req.params.immigrationOfficialId);
    const immigrationOfficialRepository = new ImmigrationOfficialRepository(
        req.body.mongo,
    );

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
    const immigrationOfficialRepository = new ImmigrationOfficialRepository(
        req.body.mongo,
    );

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
    const immigrationOfficial = new ImmigrationOfficial(immigrationOfficialId, immigrationOfficialRepository);
    const response = await immigrationOfficial.getAllPatients();
    res.status(200).json({data: response});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
});

module.exports = router;
