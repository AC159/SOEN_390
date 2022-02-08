const express = require('express');
const {UserId, Role} = require("../domain/user");
const Administrator = require("../domain/administrator");
const User = require("../domain/user");
const router = express.Router();


router.get('/admin/:adminId/users', async (req, res) => {
    try {
        const adminId = new UserId(req.params.adminId);
        const admin = new Administrator(adminId);
        const mongodb = await req.app.locals.mongodb
        const users = await admin.viewUsers(mongodb);
        res.status(200).json({
            users: users
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});

router.post('/admin/:adminId/user/:userId/role', async (req, res) => {
    try {
        let role;
        const adminId = new UserId(req.params.adminId);
        const userId = new UserId(req.params.userId);
        const admin = new Administrator(adminId);
        const mongodb = await req.app.locals.mongodb

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

        await admin.setUserRole(mongodb, new User(userId), role);
        res.status(201).send();
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});

module.exports = router;