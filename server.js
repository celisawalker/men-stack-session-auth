const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const authController = require("./controllers/auth");
const fruitsController = require('./controllers/fruits.js'); // add this

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

app.use((req, res, next) => {
    if(req.session.message){
        //res.locals makes information available to templates
        //res is the response object
        //the response object is part of our communication to the client
        res.locals.message = req.session.message;
        //now we can clear out or "nullify" or req.session.message
        req.session.message = null;
    }
    //now we can pass along the request to our routes
    next(); //next() calls the next middleware function for the route handler
})
//FUN FACT! router code is actually a type of middleware!
app.use("/auth", authController);
app.use('/fruits', fruitsController);
//any HTTP requests that come to /auth will automatically 
// be forwarded to the router code inside of the authController

//mount routes
app.get("/", (req, res) => {
    res.render("index.ejs", {
        user: req.session.user
    });
});

//protected routes - user must be logged in for access
app.get("/vip-lounge", (req, res) => {
    if(req.session.user){
        res.send("welcome to the vip lounge")
    }else{
        res.send("sorry, you must be logged in!")
    }
})

//the catch all route should ALWAYS be listed last
app.get("*", (req, res) => {
    res.status(404).render("error.ejs", {msg: "Page Not Found!"})
})

//custom error code

const handleServerError = (err) => {
    if(err.code === "EADDRINUSE"){
        console.log(`Warning! Port ${port} is already taken.`)
    }else{
        console.log("Error: ", err)
    }
}

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);

}).on("error", handleServerError);

