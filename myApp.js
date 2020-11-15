var express = require('express');
var bodyParser = require('body-parser');
var app = express();
// console.log("Hello World");
let rootPath = "/";

// parse post requests.
let parsePost = bodyParser.urlencoded({extended: false});
app.use(parsePost);

// middleware: simple logger function.
let loggerFunc = function(req, res, next){
  console.log(req.method+" "+req.path+" - "+req.ip);
  next();
};
app.use(loggerFunc);

// chain middleware: time server.
let timeCatcherFunc = function(req, res, next){
  req.time = new Date().toString();
  next();
};
let timeHandler = function(req, res){
  res.json({time: req.time});
};
let currTimePath = "/now";
app.get(currTimePath, timeCatcherFunc, timeHandler);

// echo server.
let echoHandler = function(req, res){
  res.json({echo: req.params.word});
};
let echoPath = "/:word/echo";
app.get(echoPath, echoHandler);

// get query params.
let nameHandler = function(req, res){
  res.json({name: req.query.first+" "+req.query.last});
};
let namePoster = function(req, res){
  res.json({name: req.body.first+" "+req.body.last});
};
let namePath = "/name";
app.route(namePath).get(nameHandler).post(namePoster);

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
