'use strict';

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('./auth');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const HTTPStatus = require('http-status');
mongoose.Promise = require('bluebird');
const app = express();

const mongoUri = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;
mongoose.connect(mongoUri, {
  user: process.env.DB_USER,
  pass: process.env.DB_PASSWORD,
  config: { autoIndex: false }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));
app.use(passport.initialize());
app.use(passport.session());

const db = mongoose.connection;
db.on('error', e => console.error('connection error:', e));
db.once('open', () => console.log('connection established', mongoUri));

app.use(express.static(__dirname + '/public'));

// add api routes
require('./api')(app);

app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));
app.get('/auth/facebook/callback', passport.authenticate('facebook',
  { successRedirect: '/api/users', failureRedirect: '/login' }));


app.post('/auth/login', passport.authenticate('local', { failureRedirect: '/api/users',
successRedirect:'/api/collections' })),

// global error handler
app.use((err, req, res, next) => {
  res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
});

//set port
let port = process.env.PORT || 8080;

// tell the app to listen on specified port
app.listen(port);
console.log('Server running on port: ' + port);
