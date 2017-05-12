'use strict';

const getProp = require('lodash/get');
const User = require('../models/user');
const FacebookStrategy = require('passport-facebook').Strategy;

const auth = new FacebookStrategy({
  clientID: process.env.FB_APP_ID,
  clientSecret: process.env.FB_APP_SECRET,
  callbackURL: process.env.FB_CALLBACK_URL,
  profileFields: ['id', 'displayName', 'emails', 'gender']
}, authorize);

module.exports = auth;

function authorize(accessToken, refreshToken, profile, done) {
  let facebookId = profile.id;
  let email = getProp(profile, 'emails[0].value');

  let query = { facebookId } || { email };
  User.findOne(query, (err, user) => {
    if (err) return done(err);
    if (user) return done(null, user);

    User.create({
      facebookId: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName,
      gender: profile.gender
    }, done);
  });
}
