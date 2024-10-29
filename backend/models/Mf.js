const mongoose = require('mongoose');
const { Schema } = mongoose;

const MfSchema = new Schema({
    portfolio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'portfolio',
        required: true
    },
    symbol: {
        type: String,
        required: true
    },
    nav: {
        type: Number,
        required: true
    },
    units: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('mutualfund', MfSchema);
