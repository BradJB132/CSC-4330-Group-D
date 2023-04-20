// import required packages
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// create an express app
const app = express();

// connect to MongoDB using Mongoose
mongoose.connect('mongodb+srv://website:webwebweb@tutorcenter.rdnpr1a.mongodb.net/UserAccounts', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// route for serving the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/homepage', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'Homepage.html'));
});

app.get('/navigate', (req, res) => {
  res.redirect('/homepage');
});

// start the server
const PORT = process.env.PORT || 30207;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
