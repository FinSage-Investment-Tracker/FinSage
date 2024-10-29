const mongoose = require('mongoose');
const { Schema } = mongoose;

const StockSchema = new Schema({
    portfolio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'portfolio',
        required: true
    },
    symbol: {
        type: String,
        required: true
    },
    demat: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    exchange: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['buy', 'sell'],
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('stock', StockSchema);
