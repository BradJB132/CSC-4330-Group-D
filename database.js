const mongoose = require('mongoose');
const uri = "mongodb+srv://website:webwebweb@tutorcenter.rdnpr1a.mongodb.net/UserAccounts";
// connect to MongoDB using Mongoose
mongoose.connect('mongodb+srv://website:webwebweb@tutorcenter.rdnpr1a.mongodb.net/TutorBaseData', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

/* // define the schema for a user
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  role: String
});

//user schema for students
const studentSchema = new mongoose.Schema({
  userInfo: userSchema,
  requests: [String],
  schedule: [String]
});

//user schema for tutors
const tutorSchema = new mongoose.Schema({
  userInfo: userSchema,
  requests: [String],
  subjects: [String],
  schedule: [String]
}); */

// define the schema for a user
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  role: {
    type: String,
    required: true,
    enum: ['student', 'tutor']
  }
});

// define the schema for a student
const studentSchema = new mongoose.Schema({
  requests: [String],
  schedule: [String]
});

// define the schema for a tutor
const tutorSchema = new mongoose.Schema({
  requests: [String],
  subjects: [String],
  schedule: [String]
});

//user schema for admin
const adminSchema = new mongoose.Schema({
  userInfo: userSchema,
});


/* // define the User model using the user schema
const User = mongoose.model('User', userSchema);
const Student = mongoose.model('Student', studentSchema);
const Tutor = mongoose.model('Tutor', tutorSchema); */

// create discriminator for student schema
const Student = mongoose.model('Student', studentSchema);
userSchema.discriminator('student', studentSchema);

// create discriminator for tutor schema
const Tutor = mongoose.model('Tutor', tutorSchema);
userSchema.discriminator('tutor', tutorSchema);

// define the User model using the user schema
const User = mongoose.model('User', userSchema);

const Admin = mongoose.model('Admin', adminSchema);

// export the Mongoose connection and models
module.exports = {
  connection: mongoose.connection,
  User: User,
  Student: Student,
  Tutor: Tutor,
  Admin, Admin,
 
};
