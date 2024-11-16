const express = require('express');
const router = express.Router();
const {processStockData} = require('../graphFetcher/stockDataFetcher');
const {processMFData} = require('../graphFetcher/mfDataFetcher');

router.get('/stock-data/:portfolioId', async (req, res) => {
  const portfolioId = req.params.portfolioId;  // Extract portfolioId from URL
  const duration = req.query.duration;  // Extract duration from query parameters

  try {
      const stockData = await processStockData(portfolioId, duration);  // Call the function to process data
      res.json(stockData);  // Send back the stock data as JSON
  } catch (error) {
      console.error('Error processing stock data:', error);
      res.status(500).json({ error: 'Error processing stock data', details: error.message });  // Error handling
  }
});

router.get('/mf-data/:portfolioId', async (req, res) => {
    console.log('Received request for stock data...'); // Log request received
    const portfolioId = req.params.portfolioId; // Extract portfolioId from request parameters
    const duration = req.query.duration;  // Extract duration from query parameters
    try {
      const mfData = await processMFData(portfolioId, duration); // Pass portfolioId to the processing function
      //console.log(mfData);
      res.json(mfData); 
      // Return the processed stock data as a JSON response
    } catch (error) {
      console.error('Error processing mf data:', error); // Log any errors
      res.status(500).json({ error: 'Error processing mf data' }); // Send error response
    }
  });

module.exports = router;