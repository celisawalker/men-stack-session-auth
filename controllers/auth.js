const express = require("express");
const router = express.Router();

module.exports = router;

router.get("/sign-up", (req, res) => {
    res.render("auth/sign-up.ejs");
});
//the router obj is similar to the app obj in js; however, it only has router functionality