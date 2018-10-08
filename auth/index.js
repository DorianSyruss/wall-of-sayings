'use strict';

const passport = require('passport');
const local = require('./local');
const facebook = require('./facebook');
const User = require('../models/user');

passport.use(local);
passport.use(facebook);
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => User.findById(id, done));

module.exports = passport;
