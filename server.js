// Importing required modules
const express = require('express'); // express is used to create an node js app
const app = express();
const mongoose = require('mongoose'); // mongoose is used to connect with database
require('dotenv').config(); // dotenv is used to acces constant variables from .env files.
const ejs = require('ejs'); // ejs is used to handle template engine
const path = require('path'); // path is used to access path of a particular directory.
const parser = require('body-parser'); // to send data in the form of json.
const session = require('express-session'); // to store values in session.


// Accesing routers
const index = require('./router/index');
const login = require('./router/login');
const adminDashboard = require('./router/admin');

// Setting ejs configuration and public directory for static contents
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));


// config session
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
}));


// This statement is used to connect databse
mongoose.connect(process.env.DATABASE, {useUnifiedTopology: true, useNewUrlParser: true}, () => console.log("Database connected"));


// Setting basic configurations
app.use(parser.urlencoded({ extended: false })) // configuring parser
app.use(express.json());


// setting router endpoints
app.use('/', index);
app.use('/', login);
app.use('/admin', adminDashboard);


// Setting port number as 5000 and starting connection
app.listen(5000, () => console.log("Server is starting"));
