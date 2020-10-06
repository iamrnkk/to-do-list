const express = require("express");
const bodyParser = require("body-parser");

const app= new express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));

var items = ['study','code','eat']

app.get("/",function(req,res){

  var today = new Date();
  var options= {
    weekday: "long",
    day: "numeric",
    month: "long"
  };
  var day = today.toLocaleDateString("en-US",options);
  res.render("list",{day: day, items: items});
});

app.post("/",function(req,res){

   items.push(req.body.newItem);
   res.redirect('/');

});

app.listen(3000,function(){
  console.log("server is running on port 3000");
});
