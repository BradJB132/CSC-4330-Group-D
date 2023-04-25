const mongoose = require('mongoose');
const uri = "mongodb+srv://website:webwebweb@tutorcenter.rdnpr1a.mongodb.net/UserAccounts";
// connect to MongoDB using Mongoose
mongoose.connect('mongodb+srv://website:webwebweb@tutorcenter.rdnpr1a.mongodb.net/TutorBaseData', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

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


const scheduleSchema = new Schema({
  schedule: {
    appointments: [
      {
        dayTime: {
          type: Date,
          required: true,
        },
        duration: {
          type: Number,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        reason: {
          type: String,
          required: true,
        },
        phone: {
          type: String,
          required: true,
        },
      },
    ],
  },
});

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

function acceptAppointment(student, time){

}

function declineAppointment(student, time, reason){

}

function createAppointment(student, tutor, time){

}

function removeAppointment(student, tutor, time){

}

function updateAppointment(student, tutor, time, newTime){

}

