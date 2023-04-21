    
              //methods to save signup info to database
              // add event listener to the form submission
              signupForm.addEventListener("btn", saveUser());

              function saveUser() {
                  const mongoose = require('mongoose');
                  const signupForm = document.getElementById('signup-form');
                  // Replace 'nottest' with the database name
                  const uri = "mongodb+srv://website:webwebweb@tutorcenter.rdnpr1a.mongodb.net/UserAccounts";

                  mongoose.connect(uri);

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
                              window.location.href = "index.html"; //Redirect to login page
                          }
                      });
                  }
                  else {
                      alert('Must enter LSU email');
                  }
              }
          
