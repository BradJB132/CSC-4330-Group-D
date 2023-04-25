// import required packages
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const { connection, User, Student, Tutor, Admin } = require('./database');
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
  const { firstName, lastName, email, password, role } = req.body;
  // check if the email address ends with .edu
  if (!email.endsWith('.edu')) {
    return res.status(400).send('Invalid email address. Email must end with .edu');
  }
    var myData = new User(req.body);
    myData.save()
        .then(item => {
            res.cookie('email', { email });
        })
        .catch(err => {
            res.status(400).send("Unable to save to database");
        });

    if(role == "Student"){
      var student = new Student(myData, [], []);
      student.save()
        .then(item => {
          res.render('Homepage');
        })
        .catch(err => {
          res.status(400).send("Unable to save to database");
        });
    }

    if(role == "Tutor"){
      var tutor = new Tutor(myData, [], []);
      tutor.save()
          .then(item => {
            res.render('Homepage');
          })
          .catch(err => {
            res.status(400).send("Unable to save to database");
          });
    }

    if(role == "Admin"){
      var admin = new Admin(myData);
      admin.save()
          .then(item => {
            res.render('Homepage');
          })
          .catch(err => {
            res.status(400).send("Unable to save to database");
          });
    }

});

// route for handling login requests
app.post('/login', async function(req, res) {
try{
  const { email, password } = req.body;
  const user = await User.findOne({email: req.body.email});
  if (user) {
          //check if password matches
          const result = req.body.password === user.password;
          if (result) {
             // set a cookie to indicate that the user is logged in
            res.cookie('loggedIn', true);
            //cookie to save email
            res.cookie('email', { email });
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

//Showing homepage with tutors
app.get('/homepage', async (req, res) => {
  try {
    const emailGet = req.cookies.email;
    const user = await User.findOne(emailGet);
    const firstName = user.firstName;
    const lastName = user.lastName;
    const email = user.email;
    res.render('Homepage', { firstName, lastName, email });
  } catch (error) {
    res.status(400).json({ error });
  }
});

//Showing account page
app.get('/account', async (req, res) => {
    try{
      const emailGet = req.cookies.email;
      const user = await User.findOne(emailGet);
      const firstName = user.firstName;
      const lastName = user.lastName;
      const email = user.email;
      const role = user.role;
      res.render('Account', {firstName, lastName, email, role});
    }
  catch(err){
      console.log(err);
    }
});

//Showing homepage page
app.get('/homepage', (req, res) => {
    res.render('Homepage');
});

//Showing account page
app.get('/account', (req, res) => {
    res.render('Account');
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
