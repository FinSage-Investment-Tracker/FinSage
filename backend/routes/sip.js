// routes/sip.js
const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Sip = require('../models/Sip');
const Portfolio = require('../models/Portfolio');
const { body, validationResult } = require('express-validator');
const { sipExecutor } = require('../controllers/sipExecutor');

router.post('/:portfolioId/start', fetchuser, [
    body('symbol').isString().withMessage('Symbol is required'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity is required and must be greater than 0'),
    body('startDate').isDate().withMessage('Start date is required')
], async (req, res) => {
    const { symbol, quantity, startDate, endDate } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const sip = new Sip({
            portfolio: req.params.portfolioId,
            symbol,
            quantity,
            startDate,
            endDate
        });

        await sip.save();
        res.json(sip);
        sipExecutor();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/:portfolioId/sips', fetchuser, async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ _id: req.params.portfolioId, user: req.user.id });
        if (!portfolio) {
            return res.status(404).json({ error: 'Portfolio not found' });
        }

        const sips = await Sip.find({ portfolio: req.params.portfolioId });
        res.json(sips);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.delete('/deletesip/:id', fetchuser, async (req, res) => {
    try {
        // Fetch the SIP entry by its ID
        let sip = await Sip.findById(req.params.id);
        if (!sip) {
            return res.status(404).json({ error: 'SIP not found' });
        }

        // Check if the user has access to the associated portfolio
        let portfolio = await Portfolio.findById(sip.portfolio);
        if (!portfolio) {
            return res.status(404).json({ error: 'Portfolio not found' });
        }

        if (portfolio.user.toString() !== req.user.id) {
            return res.status(401).json({ error: 'Access denied' });
        }

        // Delete the SIP entry
        await Sip.findByIdAndDelete(req.params.id);
        res.json({ "Success": "SIP stopped from today" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
