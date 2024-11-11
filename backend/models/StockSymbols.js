const mongoose = require('mongoose');

const stockSymbolSchema = new mongoose.Schema({
    symbol: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
  }
  });

// Create an index on the symbol field for fast search
stockSymbolSchema.index({ symbol: 1 });

module.exports = mongoose.model('StockSymbol', stockSymbolSchema);