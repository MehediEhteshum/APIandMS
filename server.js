require('dotenv').config();
const express = require('express');
const app = express();
const myApp = require('./app.js');
var cors = require('cors');

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

// running myApp on the same server.
app.use(myApp);

app.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
