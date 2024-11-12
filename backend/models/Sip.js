// models/Sip.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const SipSchema = new Schema({
    portfolio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'portfolio',
        required: true
    },
    symbol: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: false
    },
    lastTransactionDate: {
        type: Date,
        default: null
    }
});

module.exports = mongoose.model('sip', SipSchema);
