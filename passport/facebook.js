const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user');

passport.use(new FacebookStrategy({
  clientID: '441278002882363',
  clientSecret: 'a26d20d786dd26db5ab9352fb94b6c1a',
  callbackURL: 'https://lrckbeatxf.localtunnel.me/login/facebook/callback',
  profile_Fields: ['id', 'name', 'familyName', 'photos', 'emails']
},
// facebook will send back the tokens and profile
exports.facebook = function (access_token, refresh_token, profile, done) {

  // find the user in the database based on their facebook id
  User.find({ 'facebook_id': profile.id }, function (err, user) {

    if (err)
      return done(err);

    if (user) {
      return done(null, user); // user found, return that user

    } else {
      let userData = {
        facebook_id: profile.id,
        name: profile.name,
        lastName: profile.familyName,
        email: profile.emails[0].value
      };
      User.create({ userData })
        .then((user) => done(null, user));
    }}
  );
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});


