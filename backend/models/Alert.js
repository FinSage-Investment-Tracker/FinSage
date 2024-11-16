const mongoose = require('mongoose');
const { Schema } = mongoose;

const alertSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    symbol: {
        type: String,
        required: true
    },
    alertPrice: {
        type: Number,
        required: true
    },
    condition: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Alert", alertSchema);
