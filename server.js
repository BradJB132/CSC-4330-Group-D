// import required packages
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const { connection, User, Admin, Appointment } = require('./database');
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
  const { firstName, lastName, email, password, role, subjects } = req.body;
  // check if the email address ends with .edu
  if (!email.endsWith('.edu')) {
    return res.status(400).send('Invalid email address. Email must end with .edu');
  }
    var myData = new User(req.body);
    myData.save()
        .then(item => {
            res.cookie('email', { email });
            res.redirect('/homepage');
        })
        .catch(err => {
            res.status(400).send("Unable to save to database");
        });

    if(role == "Admin"){
      var admin = new Admin(myData);
      admin.save()
          .then(item => {
            res.redirect('/homepage');
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

//Showing homepage with tutors
app.get('/homepage', async (req, res) => {
  try {
    const emailGet = req.cookies.email;
    const user = await User.findOne(emailGet);
    if(user.role == 'Tutor')
      res.redirect('/schedule');
    const tutors = await User.find({ role: 'Tutor'});
    const firstName = user.firstName;
    const lastName = user.lastName;
    const email = user.email;
    const subjects = user.subjects;
    const role = user.role;
    if(role == "Admin")
      res.redirect('/admin');
    else
      res.render('Homepage', { tutors, emailGet });
  } catch (error) {
    res.status(400).json({ error });
  }
});

app.get('/admin', async (req, res) => {
  try{
    const students = await User.find({ role: 'Student'});
    const tutors = await User.find({ role: 'Tutor'});
 /*   const studentNames = [];
    const tutorNames = [];
    students.forEach(currentItem => {
        studentNames.push(currentItem.firstName + " " + currentItem.lastName);
    });
    tutors.forEach(currentItem => {
      tutorNames.push(currentItem.firstName + " " + currentItem.lastName);
    }); */
    res.render('Admin', {students, tutors});
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

//Showing Schedule page
app.get('/appointments', (req, res) => {
    res.redirect('/homepage');
});

// Route to handle appointment requests
app.post('/appointments', async (req, res) => {
  const { dayTime, tutorId } = req.body;

  // Validate the input data
  if (!dayTime) {
    res.status(400).send('All fields are required.');
    return;
  }

  // Convert the dayTime string to a Date object
  const date = new Date(dayTime);

  const email = req.cookies.email;
  const user = await User.findOne(email);
  
  const appointment = new Appointment();
  appointment.dayTime = date;
  appointment.student = user._id;
  appointment.tutor = tutorId;
  appointment.state = "Pending";

  appointment.save()
       .then(item => {
         res.redirect('/navSchedule');
       })
        .catch(err => {
          console.log(err);
          res.status(500).send('Unable to create appointment.');
        });
});

app.post('/accept', async (req, res) =>{
  try{
    const ID = req.body.messageId;
    //console.log("ID: " + ID);
    const data = await Appointment.findOneAndUpdate(
      {_id: ID},
      {state: "Accepted"}
    );
    //console.log("data: " + data);
    res.redirect('/inbox');
  }catch(err){
    console.log(err);
  }
});

app.post('/deny', async (req, res) =>{
  try{
    const ID = req.body.messageId;
    await Appointment.findOneAndUpdate(
      {_id: ID},
      {state: "Declined"}
      );
    await Appointment.findOneAndUpdate(
      {_id: ID},
      {message: req.body.response}
      );
    res.redirect('/inbox');
  }catch(err){
    console.log(err);
  }
});

//Showing inbox page
app.get('/inbox', async (req, res) => {
  try{
    const emailGet = req.cookies.email;
    const user = await User.findOne(emailGet);
    console.log("user: " + user);
    if(user.role == 'Student'){
      const messages = await Appointment.find({student: user._id, state: "Declined"})
      console.log("messages: " + messages);
      let names = [];
      for(i = 0 ; i < messages.length; i++){
        let temp = await User.findOne({_id: messages[i].tutor});
        names.push(temp);
      }
      console.log("names: " + names);
      res.render('StudentInbox', {messages, names});
    }
    else{
      const messages = await Appointment.find({tutor: user._id, state: 'Pending'});
      let students = [];
      for(i = 0; i < messages.length; i++){
        let temp = await User.findOne({_id: messages[i].student})
        students.push(temp);
      }

      console.log(messages);
      res.render('TutorInbox', { messages, students });
    }
  }
  catch(err){
    console.log(err);
  }
});

//Showing Schedule page
app.get('/schedule', async (req, res) => {
  try{
    const emailGet = req.cookies.email;
    const user = await User.findOne(emailGet);
    const ID = user._id;
    let schedule = [];
    let others = [];

    if(user.role == 'Student'){
      //console.log("Student");
      schedule = await Appointment.find(
        {student: ID, state: "Accepted"}
      );
      //console.log("schedule :" + schedule);
      for(i = 0; i < schedule.length; i++){
        others[i] = await User.findOne({_id: schedule[i].tutor});
      }
      //console.log("others :" + others);
    }
    else{
      //console.log("Tutor");
      schedule = await Appointment.find(
        {tutor: ID, state: "Accepted"}
        );
      //console.log("schedule :" + schedule);
      for(i = 0; i < schedule.length; i++){
        others[i] = await User.findOne({_id: schedule[i].student});
      }
      //console.log("others :" + others);
    }
    res.render('Schedule', {user, schedule, others});

  }catch(err){
    console.log(err);
  }
});

app.post('/rate', async (req, res) => {
  try{
    console.log("i run");
    const emailGet = req.cookies.email;
    const user = await User.findOne(emailGet);
    console.log("user: " + user);
    const ID = req.body.appointId;
    const appointment = await Appointment.findOne({_id: ID});
    console.log("appointment: " + appointment);
    let rating = 0;
    let numRatings = 0;
    if(user.role == "Student"){
      rating = await User.findOne({_id: appointment.tutor}).rating;
      console.log("rating1: " + rating);
      numRating = await User.findOne({_id: appointment.tutor}).numRatings;
      console.log("numRatings1: " + numRating);
      numRating += 1;
      rating = (rating + req.body.rateSelect) / numRating;
      console.log("rating2: " + rating);
      console.log("numRatings2: " + numRating);
      await User.findOneAndUpdate({_id: appointment.tutor}, {rating: rating, numRatings: numRating});
    }else{
      rating = await User.findOne({_id: appointment.student}).rating;
      numRating = await User.findOne({_id: appointment.student}).numRatings;
      numRating += 1;
      rating = (rating + req.body.rateSelect) / numRating;
      await User.findOneAndUpdate({_id: appointment.student}, {rating: rating, numRatings: numRating});
    }
    await Appointment.deleteOne({_id: ID});
    res.redirect('/schedule');
  }catch(err){
    console.log(err);
  }
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