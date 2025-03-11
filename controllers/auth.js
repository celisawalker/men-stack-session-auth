const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const bcrypt = require("bcrypt");

router.get("/sign-up", (req, res) => {
    res.render("auth/sign-up.ejs");
});
//the router obj is similar to the app obj in js; however, it only has router functionality

router.post("/sign-up", async (req, res) => {
    //check if username already exists; we don't want duplicates!
    const userInDatabase = await User.findOne({username: req.body.username});
        if(userInDatabase){
            return res.send("Username already taken!");
        }
        //check to make sure password and confirm password entries match
        if(req.body.password !== req.body.confirmPassword){
            return res.send("Passwords must match!");
    }
    //create encrypted version of password, hashed and salted(salting refers to a bit of data added to end of hash to further encrypt password)
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;

    const user = await User.create(req.body)
    res.send(`Thanks for signing up ${user.username}!`);
});

router.get("/sign-in", (req, res) => {
    res.render("auth/sign-in.ejs");
})

router.post("/sign-in", async (req, res) => {
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (!userInDatabase) {
    return res.send("Login failed. Please try again.");
    }

    const validPassword = bcrypt.compareSync(req.body.password, userInDatabase.password);

    if(!validPassword){
        res.send("Login failed. Please try again.");
    }
    //at this point we have made it past verification
    req.session.user = {
        username: userInDatabase.username,
        _id: userInDatabase._id
    };
    res.redirect("/");
})

router.get("/sign-out", (req, res) => {
    req.session.destroy();
    res.redirect("/");
})





module.exports = router;