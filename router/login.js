// Importing necessary packages
const router = require('express').Router(); // router handles each redirections.

// Importing necessary models.
const {Login} = require('../models/login')


// GET endpoint. showing login.ejs file.
router.get('/login', async (req, res) => {
    res.render('login'); // rendering login.ejs file
})


// GET endpoint. showing registration.ejs file.
router.get('/register', async (req, res) => {
    res.render('register'); // rendering registration.ejs file
})


// POST endpoint. saving registration data to database.
router.post('/register', async (req, res) => {
    const usernamExists = await Login.findOne({username: req.body.username}); // finding whether the username exist or not.
    if(usernamExists) {
        return res.render('register', {error: "Username already exists!"});
    }
    const logdata = new Login({    // adding data to Login model objects
        username: req.body.username,
        password: req.body.password,
        roleId: 1,
        name: req.body.name
    });
    await logdata.save(); // saving data to databse
    res.render('login'); // after saving. rendering login page
})



// POST endpoint. performing login operation.
router.post('/login', async (req, res) => {
    const usernameExists = await Login.findOne({username: req.body.username}); // finding whether the username exist or not.
    if(usernameExists) {
        if(usernameExists.password == req.body.password) {
            if(usernameExists.roleId == 1) {
                req.session.userid = usernameExists._id;
                res.redirect('/admin/dashboard');
            } else {
                res.render('customer/dashboard');
            }
        } else {
            res.render('login', {error: "Incorrect Password!"});
        }
    } else {
        res.render('login', {error: "incorrect Username!"});
    }
    res.render('login'); // rendering login page
})



module.exports = router; // exporting router, so that we can acces it anywhere in the code.