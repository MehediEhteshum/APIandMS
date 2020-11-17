require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

// parse post requests.
let parseBody = bodyParser.urlencoded({extended: false});
app.use(parseBody);

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// parsing URL form.
let urls = [];
let newShortUrlPath = "/api/shorturl/new";
let urlPoster = function(req, res){
  let url = req.body.url;
  let regUrl = /^https*\:\/\/\w+.\w+.\w+/;
  console.log(url.match(regUrl));
  if(!urls.includes(url) && regUrl.test(url)){
    urls.push(url);
    res.json({original_url: url, short_url: urls.indexOf(url)});
  } else{
    res.json({error: "Invalid URL"});
  }
}
app.route(newShortUrlPath).post(urlPoster);

// open short url.
let urlPath = "/api/shorturl/:index";
let urlGetter = function(req, res){
  let i = parseInt(req.params.index);
  res.redirect(urls[i]);
  console.log(res.error);
}
app.get(urlPath, urlGetter);

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
