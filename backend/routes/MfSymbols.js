const express = require('express');
const router = express.Router();
const MFSymbol = require('../models/MfSymbols');

// Endpoint to get suggestions based on symbol name
router.get('/suggestions', async (req, res) => {
    const query = req.query.query || ''; // Get the query parameter from the URL

    try {
        // Find stocks that match the beginning of the symbol (case-insensitive search)
        const matchingName = await MFSymbol.find({
            name: { $regex: `^${query}`, $options: 'i' } // '^' ensures the symbol starts with the query
        }).limit(4); // Limit the result to the first 4 matches
        const response=matchingName.map(stock=>({
            symbol: stock.symbol,
            name: stock.name
        }));
        // Return the matching stock symbols
        res.json(response);
    } catch (error) {
        console.error('Error fetching mf symbols:', error);
        res.status(500).json({ error: 'An error occurred while fetching mf symbols.' });
    }
});

module.exports = router;