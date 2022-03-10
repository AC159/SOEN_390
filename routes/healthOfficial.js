const express = require('express');
const router = express.Router();
const {UserId} = require('../domain/user');
const {HealthOfficial} = require('../domain/healthOfficial');
const HealthOfficialRepository = require('../repository/HealthOfficialRepository');

router.post('/:healthOfficialId/raise-flag', async (req, res) => {
  try {
    const patientId = req.body.patientId;
    const healthOfficialId = new UserId(req.params.healthOfficialId);
    const newFlagValue = req.body.flagValue;
    const healthOfficialRepository = new HealthOfficialRepository(req.app.locals.mongodb);

    const healthOfficial = new HealthOfficial(healthOfficialId, healthOfficialRepository);
    const response = await healthOfficial.raiseFlag(patientId, newFlagValue);
    res.status(201).json({data: response});
    console.log(response);
  } catch (e) {
    res.status(400).json({error: e.message});
    console.log("Error:"+e.message);
  }
});

router.get('/:healthOfficialId/user-covid-info', async (req, res) => {
  try {
    const userId = req.body.userId;
    const healthOfficialId = new UserId(req.params.healthOfficialId);
    const healthOfficialRepository = new HealthOfficialRepository(
        req.body.mongo,
    );

    const healthOfficial = new HealthOfficial(
        healthOfficialId,
        healthOfficialRepository,
    );
    const profile = await healthOfficial.getUserCovidInfo(userId);
    res.status(200).json({profile});
  } catch (e) {
    res.status(400).json({error: e.message});
  }
});

router.get('/:healthOfficialId/user-report', async (req, res) => {
  try {
    const userId = req.body.userId;
    const healthOfficialId = new UserId(req.params.healthOfficialId);
    const healthOfficialRepository = new HealthOfficialRepository(
        req.body.mongo,
    );

    const healthOfficial = new HealthOfficial(
        healthOfficialId,
        healthOfficialRepository,
    );
    const reports = await healthOfficial.getReportsFromUser(userId);
    res.status(200).json({reports});
  } catch (e) {
    res.status(400).json({error: e.message});
  }
});

router.get('/:healthOfficialId/report-contact-list', async (req, res) => {
  try {
    const reportId = req.body.reportId;
    const healthOfficialId = new UserId(req.params.healthOfficialId);
    const healthOfficialRepository = new HealthOfficialRepository(
        req.body.mongo,
    );

    const healthOfficial = new HealthOfficial(
        healthOfficialId,
        healthOfficialRepository,
    );
    const contacts = await healthOfficial.getContactListFromReport(reportId);
    res.status(200).json({contacts});
  } catch (e) {
    res.status(400).json({error: e.message});
  }
});

router.get('/:healthOfficialId/patients', async (req, res) => {
  try {
    const healthOfficialId = new UserId(req.params.healthOfficialId);
    const healthOfficialRepository = new HealthOfficialRepository(req.app.locals.mongodb);
    const healthOfficial = new HealthOfficial(healthOfficialId, healthOfficialRepository);
    const response = await healthOfficial.getAllPatients();
    res.status(200).json({data: response});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
});

module.exports = router;
