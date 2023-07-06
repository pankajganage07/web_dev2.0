const express = require('express')
var bodyParser = require('body-parser')
const request = require('request');
const path = require('path');
const https = require('https');


const app = express()
//app.use('/static', express.static(path.join(__dirname,'NEWS-LETTER SIGN-UP')))
app.use(express.static('pjsrc'))
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/signup.html'));
})

app.post('/', function(req, res){
  console.log("form is posting some data")
  const fname = req.body.fname
  const lname = req.body.lname
  const email = req.body.email
  console.log(fname, lname, email)



  const data = {
    members : [{
              email_address: email,
              status: "subscribed",
              merge_fields:{
                  FNAME: fname,
                  LNAME: lname
              }
    }]
  };

  const jsondata = JSON.stringify(data);
  const url = "https://us9.api.mailchimp.com/3.0/lists/51e3c3d68e";

  const options = {
    method: "POST",
    auth: "panjsrc:be78ef46b08bc755686f17d7f099e02a-us9"
  }

  const request = https.request(url, options, function(response){

    if(response.statusCode === 200){
      res.sendFile(__dirname + "/sucess.html");
    }
    else{
      res.sendFile(__dirname + "/failure.html");
    }




    response.on("data", function(data){
      console.log(JSON.parse(data));
    });
  })

  request.write(jsondata);
  request.end();
})

app.listen(3000, () =>{
    console.log("running on port 3000");
})

//api key 
//be78ef46b08bc755686f17d7f099e02a-us9

//list id
//51e3c3d68e
