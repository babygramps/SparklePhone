var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    preferred: String,
    slack: String,
    facebook: String,
    sms: String,
    email: String,
    confirmed: Boolean
});

module.exports = mongoose.model('User', userSchema);