const mongoose = require("mongoose");

const account = new mongoose.Schema({
    username:{
        type: String,
        require: [true, 'User must have a username'],
        unique: true,
    },
    email:{
        type: String,
        require: [true, 'User must have a email'],
        unique: true,
    },
    password:{
        type: String,
        require: [true, 'User must have a password'],
    },
});

module.exports = account;
