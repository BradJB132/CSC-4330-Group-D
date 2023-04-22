// import required packages
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const { connection, User } = require('./database');
var bodyParser = require('body-parser');


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

app.post("/signup", (req, res) => {
    
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
        
  // find a user with the given username and password
  User.findOne({ username: username, password: password }, (err, user) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    }
    else if (!user) {
      res.sendStatus(401);
    }
    else {
      // set the "loggedIn" cookie to the user's ID
      res.cookie('loggedIn', user._id);

      // redirect to the homepage
      res.redirect('/homepage');
    }
  });
});

// route for handling logout requests
app.post('/logout', (req, res) => {
  // clear the "loggedIn" cookie
  res.clearCookie('loggedIn');

  // redirect to the login page
  res.redirect('/');
});



app.get('/homepage', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'Homepage.html'));
});

app.get('/account', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'Account.html'));
});

app.get('/inbox', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'Inbox.html'));
});

app.get('/schedule', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'Schedule.html'));
});

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
