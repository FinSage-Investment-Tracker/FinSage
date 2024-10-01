const mongoose = require('mongoose');
const { Schema } = mongoose;

const MutualFundSchema = new Schema({
    portfolio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'portfolio',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    nav:{
        type: Number,
        required: true
    },
    investedAmount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String,
        enum: ['buy', 'sell'],
        required: true
    }
});

module.exports = mongoose.model('mutualfunds', MutualFundSchema);
