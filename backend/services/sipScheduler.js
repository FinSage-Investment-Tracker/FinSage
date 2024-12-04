const cron = require('node-cron');
const Sip = require('../models/Sip');
const StockTransaction = require('../models/StockTransaction');
const Stock = require('../models/Stock');
const fetchStockPrice = require('./fetchStockPrice');
const { sipExecutor } = require('../controllers/sipExecutor');

// Runs every second for testing purposes '*/5 * * * * *' or midnight '0 0 * * *'
cron.schedule('0 0 * * *', async () => {
    sipExecutor();
});
