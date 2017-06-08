'use strict';

const HTTPStatus = require('http-status');
const ConnectRoles = require('connect-roles');
const Roles = require('../models/user').roles;

const user = new ConnectRoles({
  failureHandler(req, res, action) {
    res.status(HTTPStatus.UNAUTHORIZED).send(`Can't ${action}`);
  }
});

user.use('authenticated', req => req.isAuthenticated());

user.use('user', req => req.user.role === Roles.User);

user.use('admin', req => req.user.role === Roles.Admin);

module.exports = { user };
