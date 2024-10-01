const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Portfolio = require('../models/Portfolio');
const Stock = require('../models/Stock');
const { body, validationResult } = require('express-validator');

// ROUTE 1: Get all stocks in a portfolio
router.get('/:portfolioId/stocks', fetchuser, async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ _id: req.params.portfolioId, user: req.user.id });
        if (!portfolio) {
            return res.status(404).json({ error: 'Portfolio not found' });
        }

        const stocks = await Stock.find({ portfolio: req.params.portfolioId });
        res.json(stocks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ROUTE 2: Add a stock to a portfolio
router.post('/:portfolioId/addstock', fetchuser, [
    body('symbol', 'Symbol is required').isLength({ min: 3 }),
    body('demat', 'Demat is required').isNumeric(),
    body('price', 'Price is required').isNumeric(),
    body('quantity', 'Quantity is required').isNumeric(),
    body('exchange', 'Exchange is required').notEmpty(),
    body('type', 'Type is required').isIn(['buy', 'sell'])
], async (req, res) => {
    try {
        const { symbol, demat, price, quantity, exchange, type } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const portfolio = await Portfolio.findOne({ _id: req.params.portfolioId, user: req.user.id });
        if (!portfolio) {
            return res.status(404).json({ error: 'Portfolio not found' });
        }

        const stock = new Stock({
            portfolio: req.params.portfolioId,
            symbol,
            demat,
            price,
            quantity,
            exchange,
            type
        });

        const savedStock = await stock.save();
        
        // Add the stock reference to the portfolio
        portfolio.stocks.push(savedStock._id);
        await portfolio.save();

        res.json(savedStock);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ROUTE 3: Update a stock
router.put('/updatestock/:id', fetchuser, async (req, res) => {
    try {
        const { symbol, demat, price, quantity, exchange, type } = req.body;
        const updatedFields = {};

        if (symbol) updatedFields.symbol = symbol;
        if (demat) updatedFields.demat = demat;
        if (price) updatedFields.price = price;
        if (quantity) updatedFields.quantity = quantity;
        if (exchange) updatedFields.exchange = exchange;
        if (type) updatedFields.type = type;

        let stock = await Stock.findById(req.params.id);
        if (!stock) {
            return res.status(404).json({ error: 'Stock not found' });
        }

        stock = await Stock.findByIdAndUpdate(
            req.params.id,
            { $set: updatedFields },
            { new: true }
        );
        res.json(stock);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ROUTE 4: Delete a stock
router.delete('/deletestock/:id', fetchuser, async (req, res) => {
    try {
        let stock = await Stock.findById(req.params.id);
        if (!stock) {
            return res.status(404).json({ error: 'Stock not found' });
        }

        await Stock.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Stock has been deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
