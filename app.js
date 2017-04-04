'use-strict';

//require needed dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const HTTPStatus = require('http-status');
const quotes = require('./api/quotes.js');
const users = require('./api/users.js');
const app = express();
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/test', { config: { autoIndex: false } });

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('connection established');
});

app.use(express.static(__dirname + '/public'));

// create route for '/' and render the 'index.ejs' file to the browser
app.get('/', function (req, res) {
  res.render('index');
});

app.use('/api', quotes);
app.use('/api', users);

app.use((err, req, res, next) => {
  res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
});

let port = process.env.PORT || 8080;  //set port

// tell the app to listen on specified port
app.listen(port);
console.log('Server running on port: ' + port);

/* Add some data to db */
//
// User({
//   name: 'Pero',
//   surname: 'Peric'
// }).save();
//
// Quote({
//   quote: 'Whats up',
//   author: 'Ivan S'
// }).save();
