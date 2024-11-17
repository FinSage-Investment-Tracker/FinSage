const mongoose = require('mongoose');
const { Schema } = mongoose;

const PLBookedSchema = new Schema({
    portfolio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'portfolio',
        required: true
    },
    symbol: {
        type: String,
        required: true
    },
    returns: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('PLBooked', PLBookedSchema);