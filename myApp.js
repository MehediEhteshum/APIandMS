var express = require('express');
var app = express();
// console.log("Hello World");
let rootPath = "/";

let stylePath = __dirname+"/public";
let styleFunc = express.static(stylePath); // middleware function for styling.
app.use(styleFunc);

// In Express, routes takes the following structure: app.METHOD(PATH, HANDLER).
// Handlers take the form function(req, res) {...}, where req is the request object, and res is the response object.
app.get(rootPath, function(req, res){
  // res.send("Hello Express");
  let filePath = __dirname+"/views/index.html";
  res.sendFile(filePath);
});

let jsonPath = rootPath+"json";
app.get(jsonPath, function(req, res){
  if(process.env.MESSAGE_STYLE==="uppercase"){
    res.json({"message": "HELLO JSON"});
  } else{
    res.json({"message": "Hello json"});
  }
});




































 module.exports = app;
