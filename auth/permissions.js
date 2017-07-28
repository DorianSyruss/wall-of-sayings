'use strict';

const HTTPStatus = require('http-status');
const ConnectRoles = require('connect-roles');
const Roles = require('../models/user').roles;
const get = require('lodash/get');

const user = new ConnectRoles({
  async: true,
  failureHandler(req, res, action) {
    res.status(HTTPStatus.UNAUTHORIZED).send(`Not ${action}`);
  }
});

// check roles strategies

user.use('auth', req => req.isAuthenticated());

user.use('admin', req => get(req, 'user.role') === Roles.Admin);

module.exports = { user };
