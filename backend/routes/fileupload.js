const express = require('express');
const multer = require('multer');
const extractExcelData = require('../controllers/fileExtractor');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Portfolio = require('../models/Portfolio');
const moment = require('moment');

const StockTransaction = require('../models/StockTransaction');

const upload = multer({ dest: 'uploads/' });

router.post('/:portfolioId/upload', upload.single('excelFile'), fetchuser, async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        const data = extractExcelData(req.file.path);


        // Save unrealised stocks to the database if they don't already exist
        await Promise.all(data.unrealised.map(async (row) => {
            const [stockName, quantity, buyDate, buyPrice] = row;

            const portfolio = await Portfolio.findOne({ _id: req.params.portfolioId, user: req.user.id });
            if (!portfolio) {
                return res.status(404).json({ error: 'Portfolio not found' });
            }

            const unrealisedStock = new StockTransaction({
                portfolio: req.params.portfolioId,
                symbol: stockName,
                quantity: parseFloat(quantity),
                date: moment(buyDate, 'DD-MM-YYYY').toDate(),
                price: parseFloat(buyPrice),
                type: 'buy'
            });
            await unrealisedStock.save();
        }));

        // Delete the temporary file after extracting data
        fs.unlink(req.file.path, (err) => {
            if (err) {
                console.error('Error deleting temporary file:', err);
            }
        });

        // Send response to frontend
        res.json({ message: 'File Data saved to MongoDB successfully' });
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).send('Error processing file');
    }
});

module.exports = router;