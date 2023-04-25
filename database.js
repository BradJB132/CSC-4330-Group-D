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

//CHANGES START HERE
// define the schema for a user
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  subjects: String,
  role: {
    type: String,
    required: true,
    enum: ['Student', 'Tutor', 'Admin']
  }
});

// define the schema for a student
const studentSchema = new mongoose.Schema({
  userInfo: userSchema,
  inbox: [String],
  schedule: [String]
});

// define the schema for a tutor
const tutorSchema = new mongoose.Schema({
  userInfo: userSchema,
  inbox: [String],
  subjects: String,
  schedule: [String]
});
//CHANGES END HERE

//user schema for admin
const adminSchema = new mongoose.Schema({
  userInfo: userSchema
});


/* // define the User model using the user schema
const User = mongoose.model('User', userSchema);
const Student = mongoose.model('Student', studentSchema);
const Tutor = mongoose.model('Tutor', tutorSchema); */

//CHANGES START HERE
// create discriminator for student schema
const Student = mongoose.model('Student', studentSchema);
userSchema.discriminator('student', studentSchema);

// create discriminator for tutor schema
const Tutor = mongoose.model('Tutor', tutorSchema);
userSchema.discriminator('tutor', tutorSchema);

const Admin = mongoose.model('Admin', adminSchema);
userSchema.discriminator('admin', adminSchema);

// define the User model using the user schema
const User = mongoose.model('User', userSchema);
//CHANGES END HERE

// export the Mongoose connection and models
module.exports = {
  connection: mongoose.connection,
  User: User,
  Student: Student,
  Tutor: Tutor,
  Admin, Admin
};

let adminButtonItems = [];
function adminButton(item){
    adminButtonItems.push(item);
}

async function requestAppointment(student, tutorID, subject, time){
  try{
    await Tutor.findOneAndUpdate(
      { _id: tutorID},
      {$push: {inbox: student + "," + subject + "," + time}},
      done
      );
  }catch (error) {
    res.status(400).json({ error });
  }
}

function acceptAppointment(student, tutorID, subject, time){
  try{
    await Tutor.findOneAndUpdate(
      {_id: tutorID},
      {$pop: {inbox: student + "," + subject + "," + time}},
      done
    );
    createAppointment(student, tutorID, subject, time);
  }catch (error) {
    res.status(400).json({ error });
  }
}

function declineAppointment(student, tutorID, time, reason){
  try{
    await Tutor.findOneAndUpdate(
      {_id: tutorID},
      {$pop: {inbox: student + "," + subject + "," + time}},
      done
      );
    await Student.findOneAndUpdate(
      {_id: tutorID},
      {$push: {inbox: tutorID + "," + subject + "," + time + "," + reason}},
      done
      );
  }catch (error) {
    res.status(400).json({ error });
  }
}

function createAppointment(student, tutorID, subject, time){
  try{
    await Tutor.findOneAndUpdate(
      { _id: tutorID},
      {$push: {schedule: student + "," + subject + "," + time}},
      done
      );
    await Student.findOneAndUpdate(
      { email: student},
      {$push: {schedule: tutorID + "," + subject + "," + time}},
      done
      );
  }catch (error) {
    res.status(400).json({ error });
  }
}

function removeAppointment(student, tutorID, subject, time){
  try{
    await Tutor.findOneAndUpdate(
      { _id: tutorID},
      {$pop: {schedule: student + "," + subject + "," + time}},
      done
      );
    await Student.findOneAndUpdate(
      { email: student},
      {$pop: {schedule: tutorID + "," + subject + "," + time}},
      done
      );
  }catch{
    res.status(400).json({ error });
  }
}

function updateAppointment(student, tutorID, time, newTime){
  try{
    await Tutor.findOneAndUpdate(
      { _id: tutorID},
      {$pop: {schedule: student + "," + subject + "," + time}},
      done
      );
    await Student.findOneAndUpdate(
      { email: student},
      {$pop: {schedule: tutorID + "," + subject + "," + time}},
      done
      );
    await Tutor.findOneAndUpdate(
      { _id: tutorID},
      {$pop: {schedule: student + "," + subject + "," + newTime}},
      done
      );
    await Student.findOneAndUpdate(
      { email: student},
      {$pop: {schedule: tutorID + "," + subject + "," + newTime}},
      done
      );
  }catch{
    res.status(400).json({ error });
  }
}

