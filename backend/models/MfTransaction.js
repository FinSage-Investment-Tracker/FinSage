const mongoose = require('mongoose');
const { Schema } = mongoose;

const MfTransactionSchema = new Schema({
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
    invested: {
        type: Number,
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

module.exports = mongoose.model('mftransaction', MfTransactionSchema);