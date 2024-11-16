const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Portfolio = require('../models/Portfolio');
const MutualFund = require('../models/Mf');
const { body, validationResult } = require('express-validator');
const MfTransaction = require('../models/MfTransaction');

// ROUTE 1: Get all mutual funds in a portfolio
router.get('/:portfolioId/mutualfunds', fetchuser, async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ _id: req.params.portfolioId, user: req.user.id });
        if (!portfolio) {
            return res.status(404).json({ error: 'Portfolio not found' });
        }

        const mutualFunds = await MutualFund.find({ portfolio: req.params.portfolioId });
        res.json(mutualFunds);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ROUTE 2: Get all mfs in a Transactions
router.get('/:portfolioId/mftransactions', fetchuser, async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ _id: req.params.portfolioId, user: req.user.id });
        if (!portfolio) {
            return res.status(404).json({ error: 'Portfolio not found' });
        }

        const transaction = await MfTransaction.find({ portfolio: req.params.portfolioId });
        res.json(transaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


// ROUTE 3: Add a mutual fund to a portfolio
router.post('/:portfolioId/addmutualfund', fetchuser, [
    body('symbol', 'Symbol is required').isLength({ min: 3 }),
    body('nav', 'NAV is required').isNumeric(),
    body('units', 'Units are required').isNumeric()
], async (req, res) => {
    try {
        const { symbol, nav, units, type, date } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const portfolio = await Portfolio.findOne({ _id: req.params.portfolioId, user: req.user.id });
        if (!portfolio) {
            return res.status(404).json({ error: 'Portfolio not found' });
        }

        const mfTransaction = new MfTransaction({
            portfolio: req.params.portfolioId,
            symbol,
            nav,
            units,
            type,
            date
        });

        

        let mf = await MutualFund.findOne({ portfolio: req.params.portfolioId, symbol });
        if (mf) {
            if (type === 'buy') {
                const total_amount = (Number(mf.nav) * Number(mf.units)) + (Number(nav) * Number(units));
                const total_quantity = Number(mf.units) + Number(units);
                mf.nav = total_amount / total_quantity;
                mf.units = total_quantity;
            } else if (type === 'sell') {
                if (mf.units < units) {
                    return res.status(400).json({ error: 'Insufficient units to sell' });
                }
                
                mf.units -= units;
        
                if (mf.units > 0) {
                    // Recalculate average NAV only if there is remaining investment
                    // mf.nav = mf.invested / (mf.invested / nav);
                    // await mf.save();
                } else {
                    // If all investment is sold, remove the MF entry
                    await MutualFund.deleteOne({ _id: mf._id });
                    portfolio.mutualFunds = portfolio.mutualFunds.filter(mfId => mfId.toString() !== mf._id.toString());
                    await portfolio.save();
                }
            }
            
            await mfTransaction.save();
            await mf.save();
        } else if (type === 'sell') {
            return res.status(400).json({ error: 'Cannot sell a mutual fund that is not in holdings' });
        }
         else {
            // Create a new holding entry if it doesn't exist
            mf = new MutualFund({
                portfolio: req.params.portfolioId,
                symbol,
                nav,
                units
            });
            await mf.save();
        }

        

        await mfTransaction.save();
        const savedMutualFund = await mf.save();
        portfolio.mutualFunds.push(savedMutualFund._id);
        await portfolio.save();

        res.json(savedMutualFund);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// // ROUTE 3: Update a mutual fund
// router.put('/updatemutualfund/:id', fetchuser, async (req, res) => {
//     try {
//         const { symbol, nav, units } = req.body;
//         const updatedFields = {};

//         if (symbol) updatedFields.symbol = symbol;
//         if (nav) updatedFields.nav = nav;
//         if (units) updatedFields.units = units;

//         let mutualFund = await MutualFund.findById(req.params.id);
//         if (!mutualFund) {
//             return res.status(404).json({ error: 'Mutual Fund not found' });
//         }

//         mutualFund = await MutualFund.findByIdAndUpdate(
//             req.params.id,
//             { $set: updatedFields },
//             { new: true }
//         );
//         res.json(mutualFund);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Server error' });
//     }
// });

// // ROUTE 4: Delete a mutual fund
// router.delete('/deletemutualfund/:id', fetchuser, async (req, res) => {
//     try {
//         let mutualFund = await MutualFund.findById(req.params.id);
//         if (!mutualFund) {
//             return res.status(404).json({ error: 'Mutual Fund not found' });
//         }

//         await MutualFund.findByIdAndDelete(req.params.id);

//         res.json({ "Success": "Mutual Fund has been deleted" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Server error' });
//     }
// });

module.exports = router;
