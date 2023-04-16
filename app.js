//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ =require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "This is a cute little blog that you could use as journal locally on your machine.";

const app = express();
const posts = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/', { useNewUrlParser: true});

const postSchema = new mongoose.Schema({
  title: String,
  body: String
});

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res) {

  Post.find().then(foundPosts => {
    res.render("home", {homeStart: homeStartingContent, blogPosts: foundPosts});  });
});

app.get("/compose", function(req, res) {

  res.render("compose");

});

app.post("/compose", function(req, res) {

  const newPost = new Post({
    title: req.body.postTitle,
    body: req.body.postBody
  });

  newPost.save();

  res.redirect("/")
});

app.get("/posts/:_id", function(req, res) {
  const postId = req.params._id;
  
  Post.findOne({_id: postId}).then( foundPost => {
    res.render("post", {title: foundPost.title, body: foundPost.body})
  });
});















app.listen(3000, function() {
  console.log("Server started on port 3000");
});
