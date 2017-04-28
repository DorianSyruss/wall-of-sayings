'use strict';

const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;

const auth = new LocalStrategy((username, password, done) => {
  User.findOne({ email: username }, (err, user) => {
    if (err) return done(err);
    if (!user) return done(null, false, { message: 'Incorrect username.' });
    user.validPassword(password, (err, valid) => {
        if (err || !valid) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
    });
  });
});

module.exports = auth;

