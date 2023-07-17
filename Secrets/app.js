require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var md5 = require('md5');

// const encrypt = require('mongoose-encryption');
//level 2 security database encryption


const app = express();

const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

mongoose.connect("mongodb://127.0.0.1:27017/secretsDB");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});


// userSchema.plugin(encrypt, {secret: process.env.SECRET_KEY, encryptedFields: ["password"]});
//level 2 security

const User = mongoose.model("user", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/submit", (req, res) => {
  res.render("submit");
});

app.post("/register", (req, res) => {
  const newuser = new User({
    username: req.body.username,
    password: md5(req.body.password)
  });
  newuser.save().then(
    () => {
      res.render("secrets");
    },
    (err) => {
      res.send("there was error registering the user" + err);
    }
  );
});

app.post('/login', (req, res) =>{
    User.findOne(
        {
            username: req.body.username
        }
    ).then((document)=>{
        if(document != null){
            if(document.password === md5(req.body.password)){
                res.render('secrets');
            }else{
                res.send("wrong password");
            }
        }else{
            res.send('register to our website');
        }
    },(err)=>{
        res.send(err);
    })
});

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});

//cmt