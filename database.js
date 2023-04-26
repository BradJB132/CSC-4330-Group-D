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
  },
  rating: {
    type: Number,
    required: false
  },
  numRatings: {
    type: Number,
    required: false
  }
});

const appointmentSchema = new mongoose.Schema({
  dayTime: {
    type: Date,
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tutor',
    required: true
  },
  state: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: false
  }
});

const rejectSchema = new mongoose.Schema({
  message: String,
  tutor: mongoose.Schema.Types.ObjectId
})


//user schema for admin
const adminSchema = new mongoose.Schema({
  userInfo: userSchema
});


//CHANGES START HERE

const Admin = mongoose.model('Admin', adminSchema);
userSchema.discriminator('admin', adminSchema);

// define the User model using the user schema
const User = mongoose.model('User', userSchema);

const Appointment = mongoose.model('Appointment', appointmentSchema);

// export the Mongoose connection and models
module.exports = {
  connection: mongoose.connection,
  User: User,
  Appointment: Appointment,
  Admin, Admin
};

let adminButtonItems = [];
function adminButton(item){
    adminButtonItems.push(item);
}

