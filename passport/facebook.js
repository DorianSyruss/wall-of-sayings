const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user');
const HTTPStatus = require('http-status');

passport.use(new FacebookStrategy({
  clientID: '441278002882363',
  clientSecret: 'a26d20d786dd26db5ab9352fb94b6c1a',
  callbackURL: '',
  profile_Fields: ['id', 'name', 'familyName', 'photos', 'emails']
},
// facebook will send back the tokens and profile
function (access_token, refresh_token, profile, done) {

  // find the user in the database based on their facebook id
  User.find({ '_id': profile.id }, function (err, user) {

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
      User.create(userData)
        .then(user => res.status(HTTPStatus.OK).send(user))
        .catch(err => next(err));
    }
  });
}));
