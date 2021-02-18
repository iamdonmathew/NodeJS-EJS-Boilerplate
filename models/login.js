// Importing necessary packages
const mongoose = require('mongoose'); // Mongoose is used to access db.


// Creating Schema. ie. fields that are used in db.
const loginSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    roleId: {
        type: Number,
        required: true
    }
});

// Exporting
const LoginSchema = mongoose.model('Login', loginSchema); // creating model using loginSchema
module.exports = { Login: LoginSchema} // Exporting LoginSchema