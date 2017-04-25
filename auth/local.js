'use strict';

const User = require('../models/user.js');
const LocalStrategy = require('passport-local').Strategy;

const auth = new LocalStrategy((username, password, done) => {
  User.findOne({ email: username }, (err, user) => {
    if (err) return done(err);
    if (!user) return done(null, false, { message: 'Incorrect username.' });
    if (!user.validPassword(password)) return done(null, false, { message: 'Incorrect password.' });
    return done(null, user);
  });
});

module.exports = auth;


//WIP

// app.post('/register', (req, res) => {
//   User.create({
//     firstName: req.body.firstName,
//     lastName: req.body.lastName,
//     password: req.body.password,
//     email: req.body.email
//   }, done());
// });
