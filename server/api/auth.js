'use strict';

const passport = require('../auth/index');
const router = require('express').Router();
const HTTPStatus = require('http-status');

router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));
router.get('/auth/facebook/callback', passport.authenticate('facebook'),
  (req, res) => {
    return res.status(HTTPStatus.OK).json({
      id: req.user.id,
      username: req.user.email
    });
});

router.post('/auth/login', passport.authenticate('local'),
  (req, res) => {
    return res.status(HTTPStatus.OK).json({
      id: req.user.id,
      username: req.user.email
    });
});

router.get('/auth/logout', (req, res) => {
  req.session.destroy(() => {
    res.status(HTTPStatus.OK);
  });
});

module.exports = router;
