const mongoose = require('mongoose');
const uri = "mongodb+srv://website:webwebweb@tutorcenter.rdnpr1a.mongodb.net/UserAccounts";
// connect to MongoDB using Mongoose
mongoose.connect('mongodb+srv://website:webwebweb@tutorcenter.rdnpr1a.mongodb.net/TutorBaseData', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// define the schema for a user
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

// define the User model using the user schema
const User = mongoose.model('User', userSchema);

// export the Mongoose connection and models
module.exports = {
  connection: mongoose.connection,
  User: User
};
