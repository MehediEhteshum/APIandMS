// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


// timestamp API endpoint.
let tsPath = "/api/timestamp/:time";
let currTsPath = "/api/timestamp";
let tsHandler = (req, res) => {
  let utcDate;
  let unixTime;
  let t = req.params.time;
  if(parseInt(t) == t){
    // seconds input
    utcDate = new Date(parseInt(t)).toUTCString();
    unixTime = t;
    res.json({unix: unixTime, utc: utcDate});
  } else{
    // yyyy-mm-dd input
    utcDate = new Date(t).toUTCString();
    unixTime = new Date(t).getTime();
    if(utcDate==="Invalid Date"){
      // invalid input    
      res.json({error: utcDate});
    } else{
      // valid input
      res.json({unix: unixTime, utc: utcDate});      
    }
  }
};
let currTsHandler = (req, res) => {
  let utcDate = new Date().toUTCString();
  let unixTime = Date.now();
  res.json({unix: unixTime, utc: utcDate});
};
app.get(tsPath, tsHandler);
app.get(currTsPath, currTsHandler);


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port + '...');
});
