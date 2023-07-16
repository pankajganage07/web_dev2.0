const express = require("express");
var bodyParser = require("body-parser");
let ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

main().catch((err) => console.log(err));

async function main() {
  //connect to database
  await mongoose.connect("mongodb://127.0.0.1/wikiDB");

  const articleSchema = mongoose.Schema({
    title: String,
    content: String,
  });

  const Article = mongoose.model("article", articleSchema);

  app
    .route("/articles")

    .get(function (req, res) {
      Article.find().then(
        (document) => {
          res.send(document);
        },
        (err) => {
          res.send(err);
        }
      );
    })

    .post(function (req, res) {
      const article1 = new Article({
        title: req.body.title,
        content: req.body.content,
      });
      article1.save().then(
        (document) => {
          res.send("sucessfully saved the article");
        },
        (err) => {
          res.send(err);
        }
      );
    })

    .delete(
      function (req, res) {
        Article.deleteMany().then((value) => {
          res.send("articles deleted sucessfully");
        });
      },
      (err) => {
        res.send(err);
      }
    );

  //get specific article
  app
    .route("/articles/:rt")

    .get(
      function (req, res) {
        Article.findOne({ title: req.params.rt }).then((document) => {
          res.send(document);
        });
      },
      (err) => {
        res.send(err);
      }
    )
      //put is used when, we want to replace the over all entry
      //for eg: if faulty cycle is delivered, then we replace the cycle with new cycle
      //so make put work like that
    .put((req, res) => {
      Article.updateOne(
        { title: req.params.rt },
        { title: req.body.title}
      ).then((document) => {
        res.send("updated sucessfully");
      },(err) => {
        res.send(err);
      });
    })

    //patch is used to only update certain fiedls
    //for eg: it will only replace the tyre of faulty cycle
    //make patch work like that
    .patch((req, res) => {
        Article.updateOne(
            { title: req.params.rt },
            { $set: req.body}
          ).then((document) => {
            res.send("updated sucessfully ");
          },(err) => {
            res.send(err);
          });
    })

    .delete((req, res)=>{
        Article.deleteOne(
            {title: req.params.rt}
        ).then(()=>{
            res.send("sucessfully deleted the article");
        },(err)=> {
            res.send(err);
        })
    });

  app.listen(3000, function () {
    console.log("server running on port 3000");
  });
}
