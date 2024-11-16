const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const { validationResult } = require('express-validator');
const Portfolio = require('../models/Portfolio');
const Gold = require('../models/Gold');

// ROUTE 1: Get all gold in portfolio
router.get('/:portfolioId/gold', fetchuser, async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ _id: req.params.portfolioId, user: req.user.id });
        if (!portfolio) {
            return res.status(404).json({ error: 'Portfolio not found' });
        }

        const gold = await Gold.find({ portfolio: req.params.portfolioId });
        res.json(gold);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ROUTE 2: Add gold in portfolio
router.post('/:portfolioId/addgold', fetchuser, async (req, res) => {
    try {

        const { type, price, date } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const portfolio = await Portfolio.findOne({ _id: req.params.portfolioId, user: req.user.id });
        if (!portfolio) {
            return res.status(404).json({ error: 'Portfolio not found' });
        }

        const gold = new Gold({
            user: req.user.id,
            portfolio: req.params.portfolioId,
            type,
            price,
            date
        });

        const saved = await gold.save();
        res.json(saved);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
