const mongoose = require('mongoose');
const { Schema } = mongoose;

const VerificationSchema = new Schema({
    email:{
        type: String,
        unique: true
    },
    code:{
        type: String
    }
});

module.exports = mongoose.model('verification', VerificationSchema);
