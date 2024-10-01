const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Portfolio = require('../models/Portfolio');
const { body, validationResult } = require('express-validator');

// ROUTE 1: Get all portfolios of the user
router.get('/fetchallportfolios', fetchuser, async (req, res) => {
    try {
        const portfolios = await Portfolio.find({ user: req.user.id })
            .populate('stocks')
            .populate('mutualFunds');
        res.json(portfolios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ROUTE 2: Add a new portfolio
router.post('/addportfolio', fetchuser, [
    body('name', 'Portfolio name is required').isLength({ min: 3 }),
    body('relationship', 'Invalid relationship').isIn(['self', 'father', 'mother', 'spouse', 'child', 'other']),
    body('pan', 'PAN is required').isLength({ min: 1, max: 10 })
], async (req, res) => {
    try {
        const { name, relationship, pan } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const portfolio = new Portfolio({
            user: req.user.id,
            name,
            relationship,
            pan
        });

        const savedPortfolio = await portfolio.save();
        res.json(savedPortfolio);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ROUTE 3: Update a portfolio
router.put('/updateportfolio/:id', fetchuser, async (req, res) => {
    try {
        const { name, relationship, pan } = req.body;
        const updatedFields = {};

        if (name) updatedFields.name = name;
        if (relationship) updatedFields.relationship = relationship;
        if (pan) updatedFields.pan = pan;

        let portfolio = await Portfolio.findById(req.params.id);
        if (!portfolio) {
            return res.status(404).json({ error: 'Portfolio not found' });
        }

        if (portfolio.user.toString() !== req.user.id) {
            return res.status(401).json({ error: 'Access denied' });
        }

        portfolio = await Portfolio.findByIdAndUpdate(
            req.params.id,
            { $set: updatedFields },
            { new: true }
        );
        res.json(portfolio);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ROUTE 4: Delete a portfolio
router.delete('/deleteportfolio/:id', fetchuser, async (req, res) => {
    try {
        let portfolio = await Portfolio.findById(req.params.id);
        if (!portfolio) {
            return res.status(404).json({ error: 'Portfolio not found' });
        }
        if (portfolio.user.toString() !== req.user.id) {
            return res.status(401).json({ error: 'Access denied' });
        }

        await Portfolio.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Portfolio has been deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
