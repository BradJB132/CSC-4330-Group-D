//const mongoose = require('mongoose');
//const uri = "mongodb+srv://website:webwebweb@tutorcenter.rdnpr1a.mongodb.net/UserAccounts";
//mongoose.connect(uri);

//const userSchema = new mongoose.Schema({
//    email: String,
//    password: String
//});

//const User = mongoose.model('User', userSchema);

//const email = "test";
//const pwd = "test2";


// Get DOM references
var p = document.getElementById("test");
var btn = document.getElementById("btn");

btn.addEventListener("click", myFunction);

function myFunction() {
    //const user = new User({ email, password });
    //user.save(function (err) {
    //    if (err) {
    //        console.error(err);
    //    } else {
    //        console.log('User saved');
    //        window.location.href = "index.html"; //Redirect to login page
    //    }
    p.innerHTML = "Working";
}