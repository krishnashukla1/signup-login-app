const mongoose = require('mongoose');

// Define User Schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

// Create and export User model
module.exports = mongoose.model('User', userSchema);    //User is collection anme inside adminlogin db
