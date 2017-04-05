'use strict';

//require needed dependencies
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const HTTPStatus = require('http-status');
const app = express();
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/test', { config: { autoIndex: false } });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('connection established');
});

app.use(express.static(__dirname + '/public'));

// create route for '/' and render the 'index.js.ejs' file to the browser
app.get('/', function (req, res) {
  res.render('index');
});

// add api routes
require('./api')(app);

// global error handler
app.use((err, req, res, next) => {
  res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
});

//set port
let port = process.env.PORT || 8080;

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
