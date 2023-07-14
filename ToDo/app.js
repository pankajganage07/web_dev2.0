const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');

const app = express();


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

main().catch(err => console.log(err));

async function main() {

//creating and connecting to our data base
mongoose.connect('mongodb+srv://pankajganage22:Pjsrc22960@cluster0.9onrxes.mongodb.net/ToDoDB?retryWrites=true&w=majority');

const itemSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model('Item', itemSchema);

const i1 = new Item({
  name: 'Welcome to my to do app'
});

const i2 = new Item({
  name: 'click + to add task'
});

const i3 = new Item({
  name: '<-- to delete task'
});

 
const default_arr = [i1, i2, i3];
var items_arr = [];

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema]
});

const List = mongoose.model('List', listSchema);




app.get('/', async function(req, res) {

  
      //get all items
      try{
        items_arr = await Item.find();
      }catch(err){
        console.log(err);
      }


  if(items_arr.length === 0){
    try{
      await Item.insertMany(default_arr);
   }catch(err){
     if(err){
       console.log(err);
     }
   }
   res.redirect('/');
  }else{
    res.render('lists', {listTitle: "Today", passingvalue: items_arr });
  }
});

app.post("/", function(req,res){

  var itemName = req.body.taskinput;
  //create new document for this document
  const item5 = new Item({
    name: itemName
  });

  var temptitle = req.body.list;
  if(temptitle === 'Today'){
    item5.save();
    res.redirect('/');
  }
  else{
    List.findOne({name: temptitle}).then((document) => {
      document.items.push(item5);
      document.save();
      res.redirect('/' + temptitle);
    }).catch((err) => {
      console.log(err);
    })
  }



});

app.post('/delete', function(req,res){
  const checkedItemId = req.body.checkbox;
  const checkedItemListName = req.body.ListName;

  if(checkedItemListName === 'Today'){
    Item.findByIdAndDelete(checkedItemId).then((document) => {
      console.log('task deleted: ', document);
    },(err) => {
      console.log(err);
    })
  
    res.redirect('/');
  }else{
    List.findOneAndUpdate({name: checkedItemListName}, { $pull: {items: {_id: checkedItemId}}}).then((document) => {
      console.log('mission deletion from custom list suceffull');
    },(err) => {
      console.log("error while deleting form custom list" + err);
    })
    res.redirect('/' + checkedItemListName);
  }


  
});


//express routing parameters
app.get('/:smthng', function(req, res) {
  var ttl = _.capitalize(req.params.smthng);

  List.findOne({ name: ttl }).then((document) => {
    if (document === null) {
      const l1 = new List({
        name: ttl,
        items: default_arr
      });
      l1.save();
      res.redirect('/' + ttl);
    } else {
      res.render('lists', { listTitle: document.name, passingvalue: document.items });
    }
  }).catch((err) => {
    console.log(err);
  });
});
  

app.get("/about", function(req, res){
  res.render('about')
});


app.listen(3000, function() {
  console.log("server started on port 3000")
});

}