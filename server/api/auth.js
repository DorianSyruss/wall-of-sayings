'use strict';

const passport = require('../auth/index');
const router = require('express').Router();

router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));
router.get('/auth/facebook/callback', passport.authenticate('facebook',
  { successRedirect: '/api/users', failureRedirect: '/login' }));

router.post('/auth/login', passport.authenticate('local'),
  (req, res) => {
    return res.status(200).json({
      id: req.user.id,
      username: req.user.username
    });
});

router.get('/auth/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/api/quotes');
  });
});

module.exports = router;
