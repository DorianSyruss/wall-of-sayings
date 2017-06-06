'use strict';

const HTTPStatus = require('http-status');
const User = require('../models/user');

function isAdmin(req, res, next) {
  if (User.isAdmin(req.user)) {
    next();
    return;
  }
  const data = {
    success: false,
    error: 'Not allowed!'
  };
  res.status(HTTPStatus.FORBIDDEN).json(data);
}

function isLoggedIn(req, res, next) {
  if (req.user) {
    next();
    return;
  }
  const data = {
    success: false,
    error: 'Not authorized!'
  };
  res.status(HTTPStatus.UNAUTHORIZED).json(data);
}

module.exports = { isAdmin, isLoggedIn };
