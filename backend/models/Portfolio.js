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
        required: true,
        unique: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    stocks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stocks'
    }],
    mutualFunds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'mutualfunds'
    }]
});

module.exports = mongoose.model('portfolio', PortfolioSchema);
