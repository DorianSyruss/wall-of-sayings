const getProp = require('lodash/get');
const User = require('../models/user');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const credentials = require('../credentials.json');

const auth = new FacebookStrategy({
  clientID: credentials.facebook.app_id,
  clientSecret: credentials.facebook.app_secret,
  callbackURL: credentials.facebook.callback,
  profileFields: ['id', 'displayName', 'emails', 'gender']
}, authorize);

module.exports = passport;

passport.use(auth);
passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser((id, done) => User.findById(id, done));

function authorize(accessToken, refreshToken, profile, done) {
  let facebookId = profile.facebook_id;
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
