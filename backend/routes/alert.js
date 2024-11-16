const express = require("express");
const router = express.Router();
const Alert = require("../models/Alert");
const fetchuser = require('../middleware/fetchuser');
const { validationResult } = require('express-validator');
const { alertExecutor } = require("../controllers/alertExecutor");

// Create an alert
router.post("/add", fetchuser, async (req, res) => {
    try {
        const { symbol, alertPrice, condition } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const alert = new Alert({
            user: req.user.id,
            symbol,
            alertPrice,
            condition
        });
        await alert.save();
        res.status(201).json(alert);
        alertExecutor();
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// fetch alerts
router.get('/fetchallalerts', fetchuser, async (req, res) => {
    try {
        const alerts = await Alert.find({ user: req.user.id });
        res.json(alerts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// delete alert
router.delete('/deletealert/:id', fetchuser, async (req, res) => {
    try {
        let alert = await Alert.findById(req.params.id);
        if (!alert) {
            return res.status(404).json({ error: 'Alert not found' });
        }

        if (alert.user.toString() !== req.user.id) {
            return res.status(401).json({ error: 'Access denied' });
        }

        await Alert.findByIdAndDelete(req.params.id);

        res.json({ "Success": "Alert have been deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
