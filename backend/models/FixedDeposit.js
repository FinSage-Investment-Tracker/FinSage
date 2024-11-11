const mongoose = require('mongoose');
const { Schema } = mongoose;

const FixedDepositSchema = new Schema({
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
    }
});

module.exports = mongoose.model('fixed deposit', FixedDepositSchema);