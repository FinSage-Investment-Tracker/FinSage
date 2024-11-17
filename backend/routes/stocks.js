const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Portfolio = require('../models/Portfolio');
const Stock = require('../models/Stock');
const { body, validationResult } = require('express-validator');
const StockTransaction = require('../models/StockTransaction');
const PLBooked = require('../models/PLBooked');

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

// ROUTE 2: Get all stocks in a Transactions
router.get('/:portfolioId/stocktransactions', fetchuser, async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ _id: req.params.portfolioId, user: req.user.id });
        if (!portfolio) {
            return res.status(404).json({ error: 'Portfolio not found' });
        }

        const transaction = await StockTransaction.find({ portfolio: req.params.portfolioId });
        res.json(transaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ROUTE 3: Add a stock to a portfolio (Buy/Sell Stock)
router.post('/:portfolioId/addstock', fetchuser, [
    body('symbol', 'Symbol is required').isLength({ min: 3 }),
    body('price', 'Price is required').isNumeric(),
    body('quantity', 'Quantity is required').isNumeric(),
    body('type', 'Type is required').isIn(['buy', 'sell'])
], async (req, res) => {
    try {
        const { symbol, price, quantity, type, date } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const portfolio = await Portfolio.findOne({ _id: req.params.portfolioId, user: req.user.id });
        if (!portfolio) {
            return res.status(404).json({ error: 'Portfolio not found' });
        }

        const stocktransaction = new StockTransaction({
            portfolio: req.params.portfolioId,
            symbol,
            price,
            quantity,
            type,
            date
        });

        let stock = await Stock.findOne({ portfolio: req.params.portfolioId, symbol });
        if (stock) {
            if (type === 'buy') {
                const total_amount = (Number(stock.price) * Number(stock.quantity)) + (Number(price) * Number(quantity));
                const total_quantity = Number(stock.quantity) + Number(quantity);
                stock.price = total_amount / total_quantity;
                stock.quantity = total_quantity;
            } else if (type === 'sell') {
                if (stock.quantity < quantity) {
                    return res.status(400).json({ error: 'Insufficient stock quantity to sell' });
                }

                // booking Profit or Loss
                const profit = (Number(price) - Number(stock.price)) * Number(quantity);
                let symbolreturn = await PLBooked.findOne({ portfolio: req.params.portfolioId, symbol });
                if(symbolreturn){
                    // update it
                    symbolreturn.returns = (Number(symbolreturn.returns) + Number(profit));
                    await symbolreturn.save();
                }
                else{
                    // new
                    const book = new PLBooked({
                        portfolio: req.params.portfolioId,
                        symbol,
                        returns: profit
                    });
                    await book.save();
                }
                
                stock.quantity -= quantity;
        
                if (stock.quantity > 0) {
                    // Recalculate average price only if there are remaining stocks
                    // stock.price = (Number(stock.price) * Number(stock.quantity)) / stock.quantity;
                    await stock.save();
                } else {
                    await Stock.deleteOne({ _id: stock._id });
                    portfolio.stocks = portfolio.stocks.filter(stockId => stockId.toString() !== stock._id.toString());
                    await portfolio.save();
                }
            }
            
            await stocktransaction.save();
            await stock.save();
        } else if (type === 'sell') {
            return res.status(400).json({ error: 'Cannot sell a stock that is not in holdings' });
        }
         else {
            // Create a new holding entry if it doesn't exist
            stock = new Stock({
                portfolio: req.params.portfolioId,
                symbol,
                price,
                quantity
            });
            await stock.save();
        }
        

        await stocktransaction.save();
        const savedStock = await stock.save();
        portfolio.stocks.push(savedStock._id);
        await portfolio.save();

        res.json(savedStock);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/:portfolioId/booked', fetchuser, async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ _id: req.params.portfolioId, user: req.user.id });
        if (!portfolio) {
            return res.status(404).json({ error: 'Portfolio not found' });
        }

        const returns = await PLBooked.find({ portfolio: req.params.portfolioId });
        res.json(returns);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


module.exports = router;
