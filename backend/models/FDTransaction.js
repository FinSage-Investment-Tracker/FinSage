const mongoose = require('mongoose');
const { Schema } = mongoose;

const FDTransactionSchema = new Schema({
    portfolio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'portfolio',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    bank: {
        type: String,
        required: true
    },
    interest: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    duration: {
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

module.exports = mongoose.model('FD transaction', FDTransactionSchema);