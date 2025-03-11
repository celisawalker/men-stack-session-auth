const mongoose = require("mongoose");

const userSchema= new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true //checks to see if username is already in db and if so, will not allow it to be made
    },
    password: {
        type: String,
        required: true
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;