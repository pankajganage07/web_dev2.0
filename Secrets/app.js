const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

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
    password: req.body.password,
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
            username: req.body.username,
            password: req.body.password
        }
    ).then((document)=>{
        if(document != null){
            res.render('secrets');
        }else{
            res.send('wrong username or password');
        }
    },(err)=>{
        res.send(err);
    })
});

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});
