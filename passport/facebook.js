const credentials = require('../credentials.json');
const User = require('../models/user');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: credentials.facebook.app_id,
    clientSecret: credentials.facebook.app_secret,
    callbackURL: credentials.facebook.callback,
    profileFields: ['id', 'displayName', 'emails', 'gender']
  },

  function (accessToken, refreshToken, profile, done) {
    let user = new User({
      facebook_id: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName,
      gender: profile.gender
    });

    User.findOne({ facebook_id: user.facebook_id } || { email: user.email }, (err, user) => {
      if(user){
        user.save((err, user) => {
          if(err) return done(err);
          done(null, user);
        });
      } else {
        done(null, user);
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
