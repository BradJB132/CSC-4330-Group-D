// import required packages
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookie = require('cookie-parser');
const cookieParser = require('cookie-parser');

// create an express app
const app = express();

// connect to MongoDB using Mongoose
mongoose.connect('mongodb+srv://website:webwebweb@tutorcenter.rdnpr1a.mongodb.net/TutorBaseData', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

//load cookie parser
app.use(cookieParser());

// serve static files from the public directory
app.use(express.static(path.join(__dirname, 'html', 'media')));

// route for serving the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
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

    const signupForm = document.getElementById('signup-form');
    signupForm.addEventListener("btn", saveUser());
    function saveUser() {
        
        const userSchema = new mongoose.Schema({
            email: String,
            password: String
        });
        const User = mongoose.model('User', userSchema);

        const email = document.getElementById('email').value;
        const password = document.getElementById('psw').value;

        if (email.endsWith('@lsu.edu')) {
            const user = new User({ email, password });
            user.save(function (err) {
                if (err) {
                    console.error(err);
                } else {
                    console.log('User saved');
                    window.location.href = "/navHomepage"; 
                }
            });
        }
        else {
            alert('Must enter LSU email');
        }
    }
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
