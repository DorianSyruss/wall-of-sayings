'use strict';

require('dotenv').config();
const passport = require('./auth');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const HTTPStatus = require('http-status');
const { db, dbUri } = require('./db');
const app = express();

db.on('error', e => console.error('connection error:', e));
db.once('open', () => console.log('connection established', dbUri));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(`${ __dirname }/public`));

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
console.log(`Server running on port: ${ port }`);
