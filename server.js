// import required packages
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const { connection, User } = require('./database');
var bodyParser = require('body-parser');
const session = require('express-session');


// create an express app
const app = express();

//load cookie parser
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// serve static files from the public directory
app.use(express.static(path.join(__dirname, 'html', 'media')));

// route for serving the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

//route for handling signup requests
app.post("/signup", (req, res) => {
  const { firstName, lastName, username, password } = req.body;
  // check if the email address ends with .edu
  if (!username.endsWith('.edu')) {
    return res.status(400).send('Invalid email address. Email must end with .edu');
  }
    var myData = new User(req.body);
    myData.save()
        .then(item => {
            res.redirect("/homepage");
        })
        .catch(err => {
            res.status(400).send("Unable to save to database");
        });
    //let firstName = req.body.firstName;
   // let lastName = req.body.lastName;
    //let username = req.body.username;
    res.cookie("firstName", req.body.firstName);
    res.cookie("lastName", req.body.lastName);
    res.cookie("username", req.body.username);
});

//Showing login form
app.get("/login", function (req, res) {
    res.render("login");
});

// route for handling login requests
app.post('/login', async function(req, res) {
try{
  const { username, password } = req.body;
  const user = await User.findOne({username: req.body.username});
  if (user) {
          //check if password matches
          const result = req.body.password === user.password;
          if (result) {
             // set a cookie to indicate that the user is logged in
            res.cookie('loggedIn', true);
            // redirect the user to the homepage
            res.redirect('/homepage');
          } else {
            res.status(400).json({ error: "password doesn't match" });
          }
        } else {
          res.status(400).json({ error: "User doesn't exist" });
        }
   }catch (error) {
        res.status(400).json({ error });
    }
});

// route for handling logout requests
app.get('/logout', function(req, res) {
  // clear the "loggedIn" cookie
  res.clearCookie('loggedIn');

  // redirect to the login page
  res.redirect('/');
});

//route for handling account page
app.get('/account', async function(req, res) {
  try {
    var username = req.cookies.username;
    var firstName = req.cookies.firstName;
    var lastName = req.cookies.lastName;
    // render the Account.html template with the user data
    return res.render("account", {
        firstName,
        lastName,
        userName,
    });  
  }catch (error) {
    res.status(400).json({ error });
});


//Showing homepage
app.get('/homepage', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'Homepage.html'));
});

//Showing account page
app.get('/account', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'Account.html'));
});

//Showing inbox page
app.get('/inbox', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'Inbox.html'));
});

//Showing Schedule page
app.get('/schedule', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'Schedule.html'));
});

//Showing Signup form
app.get('/signupform', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'SignupForm.html'));
});

app.get('/navHomepage', (req, res) => {
  res.redirect('/homepage');
});

app.get('/navAccount', (req, res) => {
    res.redirect('/account');
});

app.get('/navInbox', (req, res) => {
    res.redirect('/inbox');
});

app.get('/navSchedule', (req, res) => {
    res.redirect('/schedule');
});

app.get('/navSignup', (req, res) => {
    res.redirect('/signupform');
});

app.get('/navIndex', (req, res) => {
    res.redirect('/');
});

// start the server
const PORT = process.env.PORT || 30207;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
