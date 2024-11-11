const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Portfolio = require('../models/Portfolio');
const FixedDeposit = require('../models/FixedDeposit');
const FDTransaction = require('../models/FDTransaction');
const { body, validationResult } = require('express-validator');

// ROUTE 1: GET all FDs in portfolio
router.get('/:portfolioId/fd', fetchuser, async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ _id: req.params.portfolioId, user: req.user.id });
        if (!portfolio) {
            return res.status(404).json({ error: 'Portfolio not found' });
        }

        const fd = await FixedDeposit.find({ portfolio: req.params.portfolioId });
        res.json(fd);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ROUTE 2: GET all FDS Transactions
router.get('/:portfolioId/fdtransactions', fetchuser, async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ _id: req.params.portfolioId, user: req.user.id });
        if (!portfolio) {
            return res.status(404).json({ error: 'Portfolio not found' });
        }

        const transaction = await FDTransaction.find({ portfolio: req.params.portfolioId });
        res.json(transaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ROUTE 3: ADD FD portfolio
router.post('/:portfolioId/addFD', fetchuser, async (req, res) => {
    try {
        const {name, bank, interest, amount, duration, date, type} = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const portfolio = await Portfolio.findOne({ _id: req.params.portfolioId, user: req.user.id });
        if (!portfolio) {
            return res.status(404).json({ error: 'Portfolio not found' });
        }

        const fdtransaction = new FDTransaction({
            portfolio: req.params.portfolioId,
            name,
            bank,
            interest,
            amount,
            duration,
            date,
            type
        });

        let fixeddeposit = await FixedDeposit.findOne({ portfolio: req.params.portfolioId, name});
        if(type === 'buy'){
            fd = new FixedDeposit({
                portfolio: req.params.portfolioId,
                name,
                bank,
                interest,
                amount,
                duration
            });
            await fdtransaction.save();
            const savedFD = await fd.save();
            portfolio.fixedDeposits.push(savedFD._id);
            await portfolio.save();
        }
        else if(type === 'sell'){
            if(fixeddeposit.amount < amount){
                return res.status(400).json({ error: 'Insufficient amount' });
            }
            fixeddeposit.amount -= amount;
            if(fixeddeposit.amount > 0){
                await fixeddeposit.save();
            }else{
                await FixedDeposit.deleteOne({ _id: fixeddeposit._id });
                portfolio.fixedDeposits = portfolio.fixedDeposits.filter(fdId => fdId.toString() !== fixeddeposit._id.toString());
                await fdtransaction.save();
                await portfolio.save();
            }
        }
        const savedFD = await fd.save();
        portfolio.fixedDeposits.push(savedFD._id);
        await portfolio.save();
        res.json(savedFD);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ROUTE 4: SELL/Withdraw FD
router.post('/:portfolioId/sellFD', fetchuser, async (req, res) => {
    try {
        const {bank, interest, amount, duration, date} = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const portfolio = await Portfolio.findOne({ _id: req.params.portfolioId, user: req.user.id });
        if (!portfolio) {
            return res.status(404).json({ error: 'Portfolio not found' });
        }

        const fdtransaction = new FDTransaction({
            portfolio: req.params.portfolioId,
            bank,
            interest,
            amount,
            duration,
            date
        });
        const fd = new FixedDeposit({
            portfolio: req.params.portfolioId,
            bank,
            interest,
            amount,
            duration
        });

        await fdtransaction.save();
        const savedFD = await fd.save();
        portfolio.push(savedFD._id);
        await portfolio.save();

        res.json(savedFD);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;