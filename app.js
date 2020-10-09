const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app= new express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/toDoListDB', {useNewUrlParser: true, useUnifiedTopology: true});

itemSchema= new mongoose.Schema({
  name: String
});

const Item= mongoose.model("item",itemSchema);

const item1 = new Item({
  name: "Welcome to your to do list!"
});
const item2 = new Item({
  name: "Click + to Add item"
});
const item3 = new Item({
  name: "<--check if you want to delete an item."
});

const defaultItems = [item1,item2,item3];

app.get("/",function(req,res){

  var today = new Date();
  var options= {
    weekday: "long",
    day: "numeric",
    month: "long"
  };
  var day = today.toLocaleDateString("en-US",options);

  Item.find({},function(err,foundItems){
    if(foundItems.length === 0){

      Item.insertMany(defaultItems,function(err){
        if(err){
          console.log(err);
        }

        else{
          console.log("successfully saved items in database");
        }
      });
      res.redirect('/');
    }
    else{
      res.render("list",{day: day, items: foundItems});
    }
  });
});

app.post("/",function(req,res){

  const item = new Item({
    name: req.body.newItem
  });
  item.save();
   res.redirect('/');

});

app.post("/delete",function(req,res){
  const checkedItemId= req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId,function(err){
    if(!err){
      console.log("successfully deleted");
    }
  });
  res.redirect('/');
});

app.listen(3000,function(){
  console.log("server is running on port 3000");
});
