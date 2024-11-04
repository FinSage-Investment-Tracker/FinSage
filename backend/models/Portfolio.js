const mongoose = require('mongoose');
const { Schema } = mongoose;

const PortfolioSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    relationship: {
        type: String,
        enum: ['self', 'father', 'mother', 'spouse', 'child', 'other'],
        required: true
    },
    pan: {
        type: String,
        required: true
    },
    stocks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stock'
    }],
    mutualFunds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'mutualfund'
    }],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('portfolio', PortfolioSchema);
