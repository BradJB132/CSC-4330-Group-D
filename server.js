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

// set EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
//load cookie parser
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// serve static files from the public directory
app.use(express.static(path.join(__dirname, 'html', 'media')));

// route for serving the index.html file
app.get('/', (req, res) => {
    res.render('index');
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
            res.cookie('userInfo', { firstName, lastName, username });
            res.render('Homepage');
        })
        .catch(err => {
            res.status(400).send("Unable to save to database");
        });
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
            res.render('Homepage');
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
  res.render('index');
});



//Showing homepage
app.get('/homepage', (req, res) => {
  res.render('index');
});

//Showing account page
app.get('/account', (req, res) => {
    const userInfo = req.cookies.userInfo;
    res.render('account', { userInfo });
    //res.sendFile(path.join(__dirname, 'html', 'Account.html'));
});

//Showing inbox page
app.get('/inbox', (req, res) => {
    res.render('Inbox');
});

//Showing Schedule page
app.get('/schedule', (req, res) => {
    res.render('Schedule');
});

//Showing Signup form
app.get('/signupform', (req, res) => {
    res.render('SignupForm');
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
