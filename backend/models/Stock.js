const mongoose = require('mongoose');
const { Schema } = mongoose;

const StocksSchema = new Schema({
    portfolio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'portfolio',
        required: true
    },
    symbol:{
        type: String,
        required: true
    },
    demat:{
        type: Number,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    quantity:{
        type: Number,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },
    exchange:{
        type: String,
        required: true
    },
    type:{
        type: String,
        enum: ['buy', 'sell'],
        required: true
    }
});

module.exports = mongoose.model('stocks', StocksSchema);