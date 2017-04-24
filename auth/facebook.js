const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const credentials = require('../credentials.json');

const User = require('../models/user');

passport.use(new FacebookStrategy({
    clientID: credentials.facebook.app_id,
    clientSecret: credentials.facebook.app_secret,
    callbackURL: credentials.facebook.callback,
    profileFields: ['id', 'displayName', 'emails', 'gender']
  },
  function (accessToken, refreshToken, profile, done) {
    let newUser = new User({
      facebook_id: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName,
      gender: profile.gender
    });

    User.findOne({ facebook_id: newUser.facebook_id } || { email: newUser.email }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (user){
        return done(null, user);
      }
      else {
        newUser.save()
          .then((user) => done(null, user));
      }
    });
  }
));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  user.findById(id, function (err, user) {
    done(err, user);
  });
});

module.exports = passport;
