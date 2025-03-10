const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const authController = require("./controllers/auth");
const session = require("express-session");

const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : "3000";

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));
// Morgan for logging HTTP requests
app.use(morgan('dev'));

//FUN FACT! router code is actually a type of middleware!
app.use("/auth", authController);
//any HTTP requests that come to /auth will automatically 
// be forwarded to the router code inside of the authController

//mount routes
app.get("/", (req, res) => {
    res.render("index.ejs", {
        user: req.session.user
    });
});

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});

