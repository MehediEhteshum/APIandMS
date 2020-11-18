require('dotenv').config();
const express = require('express');
const cors = require('cors');
const urlExists = require('url-exists');
const app = express();
let mongoose;
try {
  mongoose = require("mongoose");
} catch (e) {
  console.log(e);
}
const bodyParser = require("body-parser");
const router = express.Router();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, autoIndex: false });

// check mongoose connection
router.get("/is-mongoose-ok", function(req, res) {
  if (mongoose) {
    res.json({ isMongooseOk: !!mongoose.connection.readyState });
  } else {
    res.json({ isMongooseOk: false });
  }
});

// URL Schema
let Schema = mongoose.Schema;
let urlSchema = new Schema({
  original_url: { type: String, required: true },
  short_url: { type: Number, required: true }
});

// URL Model
let Url = mongoose.model("Url", urlSchema);

app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(bodyParser.json());

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// necessary methods for db
const createAndSaveUrl = (url, lastUrlNum) => {
  let urlObj = Url({
    original_url: url,
    short_url: lastUrlNum
  });
  urlObj.save(function(err, doc) {
    if (err) {
      return console.log(err);
    }
    console.log(doc);
  });
};

// Post URL.
let lastUrlNum;
let newPath = "/api/shorturl/new";
let urlPoster = async (req, res) => {
  let url = req.body.url;
  let urlExistsInDb = await Url.exists({ original_url: url });
  let lastUrl = (await Url.find({}).sort({ _id: -1 }).limit(1))[0];
  urlExists(url, function(err, exists) {
    if (exists && !urlExistsInDb) {
      // if url exists and not in db, then save in db.
      if (lastUrl === undefined) {
        // if there is no url in db.
        lastUrlNum = 1;
      } else {
        // otherwise, add 1 to the last short url.
        lastUrlNum = lastUrl.short_url + 1;
      }
      // save new url in db.
      createAndSaveUrl(url, lastUrlNum);
      res.json({ original_url: url, short_url: lastUrlNum });
    } else if (urlExistsInDb) {
      // if url is in db.
      (async () => {
        let foundUrl = await Url.findOne({original_url: url});
        res.json({ original_url: foundUrl.original_url, short_url: foundUrl.short_url });
      })();
    } else {
      // if url is not valid.
      res.json({ error: "Invalid URL" });
    }
  });
}
app.post(newPath, urlPoster);

// open short url.
let urlPath = "/api/shorturl/:index";
let urlGetter = async function(req, res) {
  let i = parseInt(req.params.index);
  let url = await Url.findOne({ short_url: i });
  if (url === null) {
    // if short url from req is not valid/unavailable.
    res.json({ error: "Invalid URL" });
  } else {
    // if valid, redirect to the corresponding url.
    res.redirect(url.original_url);
  }
}
app.get(urlPath, urlGetter);

// // url checker using url-exist, which has 1 high vulnerability.
// let x = "dsd.com";
// (async () => {
//   let y = await urlExists(x);
//   if(y){
//     console.log(y);
//   } else{
//     console.log(y);
//   }
// })();

// url checker using url-exists.
// let x = "http://kjnknkj.com/";
// urlExists(x, function(err, exists) {
//   console.log(exists);
// });

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
