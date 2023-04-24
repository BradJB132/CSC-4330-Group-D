const mongoose = require('mongoose');
const uri = "mongodb+srv://website:webwebweb@tutorcenter.rdnpr1a.mongodb.net/UserAccounts";
// connect to MongoDB using Mongoose
mongoose.connect('mongodb+srv://website:webwebweb@tutorcenter.rdnpr1a.mongodb.net/TutorBaseData', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// define the schema for a user
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String
});

const studentSchema = new mongoose.Schema({
  userInfo: userSchema,
  requests: [String],
  schedule: [String]
});

const tutorSchema = new mongoose.Schema({
  userInfo: userSchema,
  requests: [String],
  schedule: [String]
});

const adminSchema = new mongoose.Schema({
  userInfo: userSchema,
});

// define the User model using the user schema
const User = mongoose.model('User', userSchema);
const Student = mongoose.model('Student', studentSchema);
const Tutor = mongoose.model('Tutor', tutorSchema);
const Admin = mongoose.model('Admin', adminSchema);

// export the Mongoose connection and models
module.exports = {
  connection: mongoose.connection,
  User: User,
  Student: Student,
  Tutor: Tutor,
  Admin, Admin
};
