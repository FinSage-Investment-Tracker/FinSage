// models/StockSymbol.js
const mongoose = require('mongoose');

// Define the schema for stock symbols
const mfSymbolSchema = new mongoose.Schema({
    symbol: {
      type: String,
      required: true
    },
    name: {  // New field for the stock's name
      type: String,
      required: true
  }
  });

// Create an index on the symbol field for fast search
mfSymbolSchema.index({ symbol: 1 });

module.exports = mongoose.model('MFSymbol', mfSymbolSchema);