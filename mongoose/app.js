const mongoose = require("mongoose");

main().catch(err => console.log(err));

async function main() {

//connect to db
await mongoose.connect('mongodb://127.0.0.1:27017/avengers', {useNewUrlParser: true});
//mongodb://127.0.0.1:27017/avengers




//vill schema
const villSchema = new mongoose.Schema({
    name: String,
    rating: Number,
    review: String
});

//for mongoose we need schema to store someting in collection of out database
const AvgSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    review: String,
    rival: villSchema
});

//now lets create a model, model is class to construct documents, each 
//document will be an single avenger
const avenger = mongoose.model('avenger', AvgSchema);

const a1 = new avenger({
    name: 'IronMan',
    rating: 5,
    review: 'fav'
});

// a1.save();




//lets create a another collection name villans
//schema for them will be same as avgSchema

//model for villans, model will be used to create documents, and each document
//will be a single villan
//when we insert something the model will create a collections

const villan = mongoose.model('villan', villSchema);

const v1 = new villan({
    name: "thanos",
    rating: 5,
    review: "purple"
});

const v2 = new villan({
    name: "loki",
    rating: 4,
    review: "initially villan"
});

//insert many using certain model it will insert in that collection, that model has created

//villan.insertMany([v1, v2]);


// try{
//     await villan.insertMany([v1, v2]);
// }catch(err){
//     console.log(err);
// }

//reading databases
//model name referred as collection name model_name.find()

//foll code is depricated, mongoose does not accept callback
// await avenger.find(function(err, fruits){
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log(fruits);
//     }
// });


  // Read the avengers collection
  try {
    const fruits = await avenger.find().exec();
    console.log(fruits);
  } catch (err) {
    console.log(err);
  }

  //for printing only name of villans
  try{
    const vizllans = await villan.find().exec();
    vizllans.forEach(function(item){
        console.log(item.name);
    });
  }catch(err){
    console.log(err);
  }

 //we have added validators to our avengers schema, lets check them
 const a2 = new avenger({
    name: "captain america",
    rating: 5,
    review: "awesome"
 })

//  a2.save();

//updating record
try{
    await avenger.updateOne({name: "captain america"},{name: "spider man"});
    console.log("record updated");
}catch(err){
    console.log(err);
}

//deletion
// try{
//     await villan.deleteOne({ name: 'loki' });
//     console.log("record deleted");
// }catch(err){
//     console.log(err);
// }

//delete many
try{
    const qury = await villan.deleteMany({ name: 'loki' });
    console.log(qury.deletedCount);
}catch(err){
    console.log(err);
}

//relationship
const a3 = new avenger({
    name: "captain america",
    rating: 5,
    review: "awesome",
    rival: v1 
 })

 a3.save();



}