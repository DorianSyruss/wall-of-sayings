'use strict';

const passport = require('passport');
const local = require('./local');
const facebook = require('./facebook');


passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser((id, done) => User.findById(id, done));
passport.use(local);
passport.use(facebook);

module.exports = passport;
