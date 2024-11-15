const express = require("express");
const router = express.Router();
const Alert = require("../models/Alert");
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');

// Create an alert
router.post("/", fetchuser, async (req, res) => {
    try {
        const { symbol, alertPrice } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const alert = new Alert({
            user: req.user.id,
            symbol,
            alertPrice
        });
        await alert.save();
        res.status(201).json(alert);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
